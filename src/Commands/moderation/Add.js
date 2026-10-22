var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (M.message.key.remoteJid?.endsWith('@g.us') === false)
                return void M.reply('Use this in group');
            const number = M.mentioned[0] ||
                (M.text.split(' ')[1]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
            if (!number)
                return void M.reply('Provide user');
            try {
                await this.client.sock.groupParticipantsUpdate(M.from, [number], 'add');
                return void M.reply('User added successfully');
            }
            catch (err) {
                if (err?.data?.[0]?.code === 403) {
                    const code = await this.client.sock.groupInviteCode(M.from);
                    const link = `https://chat.whatsapp.com/${code}`;
                    return void M.reply(`Cannot add user (privacy settings)\n\nSend them Invite link:\n${link}`);
                }
                return void M.reply('Failed to add user');
            }
        };
    }
};
default_1 = __decorate([
    Command('adduser', {
        description: 'Add user or send invite if privacy enabled',
        category: 'moderation',
        usage: 'adduser @user or number',
        cooldown: 5
    })
], default_1);
export default default_1;
