var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { flags, context }) => {
            if (!M.groupMetadata)
                return void M.reply('*Try Again!*');
            const hidden = flags.some(f => f.includes('hidden'));
            const quotedMsg = M.quoted?.message;
            const quotedText = quotedMsg ? (quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || quotedMsg.imageMessage?.caption || '') : '';
            const message = context ? context.trim() : quotedText;
            const senderId = M.sender.jid.includes('@lid') ?
                (M.groupMetadata.participants.find((p) => p.id === M.sender.jid)?.phoneNumber || M.sender.jid) :
                M.sender.jid;
            let text = `${message !== '' ? `📮 *Message:* ${message}\n\n` : ''}🚡 *Group:* ${M.groupMetadata.subject}\n👥 *Members:* ${M.groupMetadata.participants.length}\n👤 *Tagger:* @${senderId.split('@')[0]}\n🔖 *Tags:* ${hidden ? '*[HIDDEN]*' : ''}\n`;
            if (!hidden) {
                const tagText = M.groupMetadata.participants
                    .map((p) => {
                    const display = p.phoneNumber ? p.phoneNumber.split('@')[0] : p.id.split('@')[0];
                    return `💠 @${display}`;
                })
                    .join('\n');
                text += `\n${tagText}`;
            }
            return void (await M.reply(text, 'text', undefined, undefined, undefined, M.groupMetadata.participants.map((x) => x.id)));
        };
    }
};
default_1 = __decorate([
    Command('ping', {
        description: 'Tags all of the members in a group line by line',
        usage: 'ping (--tags=hidden)',
        category: 'moderation',
        exp: 35,
        cooldown: 15,
        aliases: ['announce', 'tagall', 'everyone']
    })
], default_1);
export default default_1;
