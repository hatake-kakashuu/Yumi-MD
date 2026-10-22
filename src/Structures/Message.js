import { downloadMediaMessage } from '@whiskeysockets/baileys';
export class Message {
    get hasSupportedMediaMessage() {
        return ['imageMessage', 'videoMessage', 'documentMessage'].includes(this.type);
    }
    constructor(sock, msg) {
        this.reply = async (content, type = 'text', gifPlayback, mimetype, caption, mentions, externalAdReply, thumbnail, filename) => {
            const quoted = this.message;
            if (typeof content === 'string' || type === 'text') {
                const msg = { text: content };
                if (mentions && mentions.length) {
                    msg.contextInfo = msg.contextInfo || {};
                    msg.contextInfo.mentionedJid = mentions;
                }
                if (externalAdReply) {
                    msg.contextInfo = msg.contextInfo || {};
                    msg.contextInfo.externalAdReply = {
                        title: externalAdReply.title,
                        body: externalAdReply.body,
                        mediaType: externalAdReply.mediaType ?? 1,
                        thumbnail: externalAdReply.thumbnail,
                        mediaUrl: externalAdReply.mediaUrl || externalAdReply.sourceUrl,
                        renderLargerThumbnail: true
                    };
                }
                await this.sock.sendMessage(this.from, msg, { quoted });
                return;
            }
            const buf = content;
            if (type === 'image') {
                await this.sock.sendMessage(this.from, { image: buf, caption, mentions, jpegThumbnail: thumbnail }, { quoted });
                return;
            }
            if (type === 'video') {
                await this.sock.sendMessage(this.from, { video: buf, caption, gifPlayback: gifPlayback ?? false, mimetype, mentions }, { quoted });
                return;
            }
            if (type === 'audio') {
                const msg = {
                    audio: buf,
                    mimetype: mimetype || 'audio/mpeg',
                    ptt: false
                };
                if (externalAdReply) {
                    msg.contextInfo = {
                        externalAdReply: {
                            title: externalAdReply.title,
                            body: externalAdReply.body,
                            mediaType: externalAdReply.mediaType ?? 2,
                            thumbnail: externalAdReply.thumbnail,
                            mediaUrl: externalAdReply.mediaUrl || externalAdReply.sourceUrl,
                            renderLargerThumbnail: true
                        }
                    };
                }
                await this.sock.sendMessage(this.from, msg, { quoted });
                return;
            }
            if (type === 'sticker') {
                await this.sock.sendMessage(this.from, { sticker: buf }, { quoted });
                return;
            }
            if (type === 'document') {
                await this.sock.sendMessage(this.from, {
                    document: buf,
                    mimetype: mimetype || 'application/octet-stream',
                    fileName: filename,
                    caption,
                    jpegThumbnail: thumbnail
                }, { quoted });
                return;
            }
        };
        this.downloadMediaMessage = async (msg) => {
            const target = msg?.key ? msg : { key: this.message.key, message: msg };
            return (await downloadMediaMessage(target, 'buffer', {}, { logger: undefined, reuploadRequest: this.sock.updateMediaMessage }));
        };
        this.react = async (emoji, key) => {
            await this.sock.sendMessage(this.from, {
                react: {
                    text: emoji,
                    key: key || this.message.key
                }
            });
        };
        this.sock = sock;
        this.message = msg;
        this.from = msg.key.remoteJid || '';
        const isGroup = this.from.endsWith('@g.us');
        const senderJid = isGroup
            ? msg.key.participant || msg.key.remoteJid || ''
            : msg.key.remoteJid || '';
        const ownerEnv = (process.env.OWNER_NUMBER || '').trim();
        const modsEnv = (process.env.MODS || '').trim();
        const envEntries = [
            ...ownerEnv.split(','),
            ...modsEnv.split(',')
        ]
            .map(e => e.trim().replace(/\r/g, ''))
            .filter(Boolean);

        const senderDigits = senderJid.replace(/[^0-9]/g, '');
        const isMod = Boolean(msg.key?.fromMe) || envEntries.some(entry => {
            const entryDigits = entry.replace(/[^0-9]/g, '');
            if (entryDigits && senderDigits === entryDigits) return true;
            if (entry.includes('@') && senderJid.toLowerCase() === entry.toLowerCase()) return true;
            return false;
        });
        this.sender = {
            jid: senderJid,
            name: msg.pushName || senderJid.split('@')[0],
            username: msg.pushName || senderJid.split('@')[0],
            isMod
        };
        const m = msg.message || {};
        const skip = new Set(['messageContextInfo', 'senderKeyDistributionMessage', 'protocolMessage']);
        this.type = Object.keys(m).find(k => !skip.has(k)) || 'unknown';
        this.text =
            m.conversation ||
                m.extendedTextMessage?.text ||
                m.imageMessage?.caption ||
                m.videoMessage?.caption ||
                m.documentMessage?.caption ||
                '';
        this.urls = Array.from(this.text.matchAll(/https?:\/\/[^\s)>\]]+/g)).map(r => r[0]);
        this.numbers = (this.text.match(/\d+/g) || []).map(Number);
        const ctxInfo = m.extendedTextMessage?.contextInfo ||
            m.imageMessage?.contextInfo ||
            m.videoMessage?.contextInfo ||
            m.audioMessage?.contextInfo ||
            m.documentMessage?.contextInfo ||
            m.stickerMessage?.contextInfo;
        this.mentioned = ctxInfo?.mentionedJid || [];
        if (ctxInfo?.quotedMessage && ctxInfo.stanzaId) {
            const qm = ctxInfo.quotedMessage;
            const qType = Object.keys(qm).find(k => !skip.has(k)) || 'unknown';
            const qParticipant = ctxInfo.participant || this.from;
            const qText = qm.conversation ||
                qm.extendedTextMessage?.text ||
                qm.imageMessage?.caption ||
                qm.videoMessage?.caption ||
                qm.documentMessage?.caption ||
                '';
            this.quoted = {
                key: {
                    remoteJid: this.from,
                    id: ctxInfo.stanzaId,
                    fromMe: ctxInfo.participant ? false : true,
                    participant: ctxInfo.participant
                },
                message: qm,
                content: qText,
                type: qType,
                sender: { jid: qParticipant },
                hasSupportedMediaMessage: ['imageMessage', 'videoMessage', 'documentMessage'].includes(qType)
            };
        }
        else {
            this.quoted = null;
        }
    }
    get emojis() {
        const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu;
        return this.text.match(emojiRegex) || [];
    }
}
