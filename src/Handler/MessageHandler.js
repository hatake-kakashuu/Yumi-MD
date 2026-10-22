import { Message } from '../Structures/Message.js';
import { commands, aliases } from '../Structures/decorators.js';
import { Logger } from '../lib/logger.js';
function buildArgs(rawArgs) {
    const flags = rawArgs.filter(a => a.startsWith('--'));
    const args = rawArgs.filter(a => !a.startsWith('--'));
    return {
        args: rawArgs,
        context: args.join(' '),
        flags
    };
}
export class MessageHandler {
    constructor(client) {
        this.client = client;
        this.haigushaResponse = new Map();
        this.chess = {
            challenges: new Map(),
            ongoing: new Set(),
            games: new Map()
        };
        this.quiz = {
            board: new Map(),
            game: new Map(),
            answered: new Map(),
            forfeitable: new Map(),
            timer: new Map()
        };
        this.handle = async (m) => {
            if (!m.messages || !m.messages.length) return;
            if (m.type && m.type !== 'notify') return;

            for (const rawMsg of m.messages) {
                if (rawMsg?.key?.id && rawMsg?.message) {
                    this.client.msgStore.set(rawMsg.key.id, rawMsg);
                    if (this.client.msgStore.size > 2000) {
                        const oldest = this.client.msgStore.keys().next().value;
                        this.client.msgStore.delete(oldest);
                    }
                }
            }

            for (const msg of m.messages) {
                if (!msg?.message) continue;
                if (msg.key?.remoteJid === 'status@broadcast' || msg.key?.remoteJid?.endsWith('@broadcast')) continue;
                this.processMessage(msg).catch(err => {
                    Logger.error(`Handler error: ${err.message}`);
                });
            }
        };

        this.processMessage = async (msg) => {
            const M = new Message(this.client.sock, msg);
            if (msg.key?.fromMe && this.client.mode !== 'self') return;

            const text = M.text;
            if (!text.startsWith(this.client.prefix)) {
                const groupName = M.from.endsWith('@g.us')
                    ? (this.client.groupMetadataCache.get(M.from)?.subject || '')
                    : '';
                Logger.chat(this.client.botName, M.sender.name, groupName);
                if (!M.from.endsWith('@g.us') && M.urls.length > 0) {
                    if (this.client.mode === 'self' && !M.sender.isMod) return;
                    const patterns = [
                        { pattern: /instagram\.com\/(?:(?:p|tv|reel|share\/reel))\/[\w-]+\/?/i, command: 'instagram' },
                        { pattern: /(tiktok\.com|vt\.tiktok\.com)/i, command: 'tiktok' },
                        { pattern: /(twitter|x)\.com\/.*\/status\/\d+/i, command: 'twitter' },
                        { pattern: /facebook\.com|fb\.watch|fb\.com/i, command: 'fbdl' },
                        { pattern: /pinterest\.com|pin\.it/i, command: 'pindl' },
                        { pattern: /youtube\.com|youtu\.be/i, command: 'ytv' },
                        { pattern: /sticker\.ly\/s\//i, command: 'stickerly' },
                        { pattern: /t\.me\/addstickers/i, command: 'tele-sticker' }
                    ];
                    for (const url of M.urls) {
                        const matched = patterns.find(p => p.pattern.test(url));
                        if (matched) {
                            const cmdData = commands.get(matched.command);
                            if (cmdData) {
                                const command = new cmdData.class(this.client);
                                const iargs = {
                                    args: [url],
                                    context: url,
                                    flags: []
                                };
                                try {
                                    Logger.autoDl(this.client.botName, matched.command, M.sender.name, url);
                                    M.react('📥').catch(() => {});
                                    await command.execute(M, iargs);
                                }
                                catch (err) {
                                    Logger.error(`Auto-downloader error for ${matched.command}: ${err.message}`);
                                }
                                return;
                            }
                        }
                    }
                }
                return;
            }
            if (this.client.mode === 'self' && !M.sender.isMod) {
                return;
            }
            const rawArgs = text.trim().split(/ +/);
            const cmdName = rawArgs.shift().slice(this.client.prefix.length).toLowerCase();
            const realName = commands.has(cmdName) ? cmdName : aliases.get(cmdName);
            if (!realName) {
                await this.client.sock.sendMessage(M.from, { text: `No Such Command: ${cmdName}` });
                return;
            }
            const cmdData = commands.get(realName);
            if (!cmdData)
                return;
            if (cmdData.category !== 'dev') {
                const deniedEntry = await this.client.DB.isCommandDenied(realName);
                if (deniedEntry) {
                    await this.client.sock.sendMessage(M.from, {
                        text: `🚫 *Command Disabled!*\n\n*${this.client.prefix}${realName}* is currently denied globally.\n📮 *Reason:* ${deniedEntry.reason || 'Under maintenance'}`
                    }, { quoted: M.message });
                    return;
                }
            }
            if (cmdData.category === 'dev' && !M.sender.isMod) {
                await this.client.sock.sendMessage(M.from, { text: '🟨 *This command is only for Bot Moderators/Developers!*' });
                return;
            }

            if (M.from.endsWith('@g.us')) {
                M.groupMetadata = await this.client.groupMetadata(M.from);
            }

            if (cmdData.category === 'moderation') {
                if (M.from.endsWith('@g.us')) {
                    const isAdmin = M.groupMetadata?.participants?.find((p) => p.id === M.sender.jid)?.admin;
                    if (!isAdmin && !M.sender.isMod) {
                        await this.client.sock.sendMessage(M.from, { text: '🟨 *This command is only for Group Admins or Bot Moderators!*' });
                        return;
                    }
                }
                else {
                    if (!M.sender.isMod) {
                        await this.client.sock.sendMessage(M.from, { text: '🟨 *This command can only be used by Bot Moderators in DMs!*' });
                        return;
                    }
                }
            }
            if (cmdData.category === 'nsfw') {
                if (M.from.endsWith('@g.us')) {
                    const group = await this.client.DB.getGroup(M.from);
                    if (!group.nsfw) {
                        await this.client.sock.sendMessage(M.from, { text: '🟨 *This command will work in NSFW enabled groups.*' });
                        return;
                    }
                }
            }
            const iargs = buildArgs(rawArgs);
            const argText = rawArgs.length ? `[${rawArgs.join(' ')}]` : '';
            const groupName = M.from.endsWith('@g.us')
                ? (M.groupMetadata?.subject || this.client.groupMetadataCache.get(M.from)?.subject || '')
                : '';
            Logger.command(this.client.botName, `${this.client.prefix}${cmdName}`, argText, M.sender.name, groupName);
            const command = new cmdData.class(this.client);
            try {
                await command.execute(M, iargs);
            }
            catch (err) {
                Logger.error(`Command error: ${err.message}`);
                await this.client.sock.sendMessage(M.from, { text: 'An error occurred. Please try again.' });
            }
        };
    }
}
