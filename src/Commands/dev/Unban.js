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
        this.execute = async ({ mentioned, quoted, reply }) => {
            const users = mentioned;
            const arr = [];
            if (quoted && !users.includes(quoted.sender.jid))
                users.push(quoted.sender.jid);
            if (users.length <= 0)
                return void reply(`🟥 *Tag/quote a user to unban*`);
            let text = '*🚥Status:*\n';
            for (const user of users) {
                const { ban } = await this.client.DB.getUser(user);
                if (!ban?.banned) {
                    reply(`🟨 Skipped *@${user.split('@')[0]}* as he's already unbanned`, 'text', undefined, undefined, undefined, [user]);
                    continue;
                }
                await this.client.DB.unbanUser(user);
                text += `\n✅ Unbanned: *@${user.split('@')[0]}*`;
                arr.push(user);
            }
            return void reply(text, 'text', undefined, undefined, undefined, arr);
        };
    }
};
command = __decorate([
    Command('unban', {
        description: 'Unbans a user',
        category: 'dev',
        usage: 'unban [tag/quote users]'
    })
], command);
export default command;
