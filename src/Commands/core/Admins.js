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
        this.execute = async (M, { context }) => {
            if (!M.groupMetadata)
                return void M.reply('*This command can only be used in groups!*');
            const quotedMsg = M.quoted?.message;
            const quotedText = quotedMsg ? (quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || quotedMsg.imageMessage?.caption || '') : '';
            const message = context ? context.trim() : quotedText;
            const admins = M.groupMetadata.participants.filter((p) => p.admin);
            if (!admins.length)
                return void M.reply('*No admins found in this group!*');
            const adminTags = admins.map((a) => {
                const jid = a.id;
                const displayId = a.phoneNumber ? a.phoneNumber.split('@')[0] : jid.split('@')[0];
                return {
                    jid,
                    text: `💠 @${displayId}`
                };
            });
            const text = `${message !== '' ? `📮 *Message:* ${message}\n\n` : ''}👑 *Group Admins:* (Total: ${admins.length})\n\n${adminTags
                .map((a) => a.text)
                .join('\n')}`;
            await M.reply(text, 'text', undefined, undefined, undefined, adminTags.map((a) => a.jid));
        };
    }
};
default_1 = __decorate([
    Command('tagadmins', {
        description: 'Tags only admins in a group line by line',
        usage: 'tagadmins [message]',
        category: 'core',
        exp: 25,
        cooldown: 10,
        aliases: ['admins', 'pingadmins']
    })
], default_1);
export default default_1;
