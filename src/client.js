import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import { Utils } from './lib/utils.js';
import { loadCommands } from './lib/loader.js';
import { Logger } from './lib/logger.js';
import { Database } from './Structures/Database.js';
import { MessageHandler } from './Handler/MessageHandler.js';
import { EventHandler } from './Handler/event.js';
import { config } from './config.js';

export class Client {
    constructor(options = {}) {
        this.botName = options.botName || config.botName;
        this.processedMessages = new Set();
        this.assets = new Map([
            ['left', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')],
            ['right', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')]
        ]);
        this.qrCode = null;
        this.connectionStatus = 'connecting';
        this.locks = new Map();
        this.activeTrades = new Map();
        this.msgStore = new Map();
        this.groupMetadataCache = new Map();
        this.contact = {
            getContact: (jid) => {
                return {
                    username: jid.split('@')[0]
                };
            }
        };
        this.prefix = options.prefix || config.prefix;
        this.ownerName = options.ownerName || config.ownerName || 'Kakashi';
        this.ownerNumber = options.ownerNumber || config.ownerNumber || '';
        this.mode = options.mode || config.mode || 'public';
        this.logLevel = options.logLevel || config.logLevel;
        this.sessionFolder = options.sessionFolder || config.sessionFolder;
        this.utils = new Utils();
        this.config = {
            prefix: this.prefix,
            ownerName: this.ownerName,
            ownerNumber: this.ownerNumber,
            casinoGroup: [],
            gkey: config.googleApiKey,
            mods: config.mods
        };
        this.DB = new Database(config.mongoUri);
        this.handler = new MessageHandler(this);
        this.eventHandler = new EventHandler(this);
    }

    async getGroupName(jid) {
        if (!jid.endsWith('@g.us')) return '';
        if (this.groupMetadataCache.has(jid)) {
            return this.groupMetadataCache.get(jid).subject || jid;
        }
        try {
            const metadata = await this.groupMetadata(jid);
            return metadata?.subject || jid;
        } catch {
            return jid;
        }
    }

    get user() {
        return this.sock?.user;
    }

    log(message) {
        console.log(message);
    }

    correctJid(jid) {
        if (!jid) return '';
        return jid.includes('@') ? `${jid.split('@')[0].split(':')[0]}@${jid.split('@')[1]}` : jid;
    }

    async loadMetadata(jid) {
        const metadata = await this.groupMetadata(jid);
        return {
            subject: metadata?.subject || '',
            desc: metadata?.desc || '',
            participants: metadata?.participants || []
        };
    }

    async getAllGroups() {
        try {
            const groups = await this.sock.groupFetchAllParticipating();
            for (const [id, metadata] of Object.entries(groups)) {
                this.groupMetadataCache.set(id, metadata);
            }
            return Object.keys(groups);
        } catch {
            return [];
        }
    }

    async groupMetadata(jid) {
        if (!jid || !jid.endsWith('@g.us')) return null;
        const cached = this.groupMetadataCache.get(jid);
        if (cached && (Date.now() - (cached._cachedAt || 0) < 5 * 60 * 1000)) {
            return cached;
        }
        try {
            const metadata = await this.sock.groupMetadata(jid);
            if (metadata) {
                metadata._cachedAt = Date.now();
                this.groupMetadataCache.set(jid, metadata);
            }
            return metadata;
        } catch {
            return cached || null;
        }
    }

    groupLeave(jid) {
        return this.sock.groupLeave(jid);
    }

    groupSettingUpdate(jid, setting) {
        return this.sock.groupSettingUpdate(jid, setting);
    }

    profilePictureUrl(jid, type = 'image') {
        return this.sock.profilePictureUrl(jid, type);
    }

    sendMessage(jid, content, options) {
        return this.sock.sendMessage(jid, content, options);
    }

    async setMode(newMode) {
        this.mode = newMode;
        await this.DB.setBotSetting('mode', newMode);
        Logger.info(`Bot operating mode changed to: ${newMode.toUpperCase()}`);
    }

    async start() {
        if (!fs.existsSync(this.sessionFolder)) {
            fs.mkdirSync(this.sessionFolder, { recursive: true });
        }
        await loadCommands();
        Logger.info('Commands loaded successfully.');
        await this.DB.connect();
        const savedMode = await this.DB.getBotSetting('mode', this.mode);
        this.mode = savedMode;
        Logger.info(`Bot operating mode: ${this.mode.toUpperCase()}`);

        const { state, saveCreds } = await useMultiFileAuthState(this.sessionFolder);
        const { version } = await fetchLatestBaileysVersion();

        this.sock = makeWASocket({
            version,
            auth: state,
            logger: pino({ level: 'fatal' }),
            syncFullHistory: false,
            markOnlineOnConnect: false,
            generateHighQualityLinkPreview: false,
            shouldIgnoreJid: (jid) => jid === 'status@broadcast' || jid?.endsWith('@broadcast'),
            defaultQueryTimeoutMs: 15000,
            getMessage: async (key) => {
                const stored = this.msgStore.get(key.id);
                return stored?.message ?? undefined;
            }
        });

        this.sock.ev.on('creds.update', saveCreds);

        this.sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                this.qrCode = qr;
                qrcode.generate(qr, { small: true });
                Logger.info('📱 Scan the QR code using WhatsApp to log in');
            }
            if (connection === 'open') {
                this.connectionStatus = 'open';
                this.qrCode = null;
                Logger.success('Connected to WhatsApp!');
            } else if (connection === 'close') {
                this.connectionStatus = 'close';
                const reason = lastDisconnect?.error?.output?.statusCode;
                if (reason === DisconnectReason.loggedOut) {
                    Logger.error('Logged out. Clearing session and generating a new QR...');
                    fs.rmSync(this.sessionFolder, { recursive: true, force: true });
                    this.start();
                } else {
                    Logger.warn(`[${this.botName}] Reconnecting...`);
                    this.start();
                }
            }
        });

        this.sock.ev.on('messages.upsert', async (m) => {
            this.handler.handle(m).catch(err => {
                console.error('Messages upsert error:', err);
            });
        });

        this.sock.ev.on('group-participants.update', async (event) => {
            try {
                if (this.groupMetadataCache.has(event.id)) {
                    const cached = this.groupMetadataCache.get(event.id);
                    if (cached && Array.isArray(cached.participants)) {
                        if (event.action === 'add') {
                            for (const p of event.participants) {
                                const pId = typeof p === 'string' ? p : p?.id;
                                if (pId && !cached.participants.some(x => x.id === pId)) {
                                    cached.participants.push({ id: pId, admin: null });
                                }
                            }
                        } else if (event.action === 'remove') {
                            const removed = new Set(event.participants.map(p => typeof p === 'string' ? p : p?.id));
                            cached.participants = cached.participants.filter(x => !removed.has(x.id));
                        } else if (event.action === 'promote') {
                            const promoted = new Set(event.participants.map(p => typeof p === 'string' ? p : p?.id));
                            for (const p of cached.participants) {
                                if (promoted.has(p.id)) p.admin = 'admin';
                            }
                        } else if (event.action === 'demote') {
                            const demoted = new Set(event.participants.map(p => typeof p === 'string' ? p : p?.id));
                            for (const p of cached.participants) {
                                if (demoted.has(p.id)) p.admin = null;
                            }
                        }
                    }
                }
                await this.eventHandler.handleEvents(event);
            } catch (err) {
                console.error('Event handler error:', err);
            }
        });

        this.sock.ev.on('groups.update', async (updates) => {
            for (const update of updates) {
                if (update?.id && this.groupMetadataCache.has(update.id)) {
                    const cached = this.groupMetadataCache.get(update.id);
                    Object.assign(cached, update);
                }
            }
        });

        this.sock.ev.on('messages.update', async () => {});
        this.sock.ev.on('call', () => {});
    }
}

export default Client;
