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
        this.execute = async ({ quoted, reply }, { context }) => {
            if (!quoted && !context) {
                return void reply('🟥 *Provide the invite link next to the command or by quoting the message that has the invite link.*');
            }
            const quotedMsg = quoted?.message;
            const quotedText = quotedMsg ? (quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || quotedMsg.imageMessage?.caption || '') : '';
            const body = context?.trim() || quotedText;
            const urls = this.client.utils.extractUrls(body).filter((url) => url.includes('chat.whatsapp.com'));
            if (!urls.length) {
                return void reply("🟨 *I don't see any invite links.*");
            }
            const rawCode = urls[0].split('/').pop();
            const code = rawCode?.split('?')[0];
            try {
                await this.client.sock.groupAcceptInvite(code);
                await reply('✅ *Successfully joined the group!*');
            }
            catch (err) {
                console.error(err);
                return void reply("🟨 *Can't join the group. Check if the invite link is valid, or maybe I was removed.*");
            }
        };
    }
};
default_1 = __decorate([
    Command('join', {
        description: 'Joins a group from the provided invite link',
        category: 'dev',
        dm: true,
        usage: 'join [link]'
    })
], default_1);
export default default_1;
