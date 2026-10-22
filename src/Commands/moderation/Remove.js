var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (!M.groupMetadata)
                return void M.reply('*Try Again!*');
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            if (!users.length || users.length < 1)
                return void M.reply('Tag the users that you want to remove.');
            const mentioned = users;
            let text = '';
            for (const user of users) {
                const i = users.indexOf(user);
                if (i === 0)
                    text += '\n';
                if (user === M.groupMetadata.owner || '') {
                    text += `Skipped @${user.split('@')[0]} as they're the owner.`;
                    continue;
                }
                await this.client.sock.groupParticipantsUpdate(M.from, [user], 'remove');
                text += `*🚥Status:*\n\n✅Removed *@${user.split('@')[0]}*`;
            }
            return void M.reply(text, 'text', undefined, undefined, undefined, mentioned);
        };
    }
};
command = __decorate([
    Command('remove', {
        description: '',
        category: 'moderation',
        usage: '',
        cooldown: 10,
        exp: 10,
        adminRequired: true
    })
], command);
export default command;
