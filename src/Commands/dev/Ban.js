var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const { reply, quoted, mentioned, sender, groupMetadata } = M;
            if (!groupMetadata)
                return void reply('*Try Again!*');
            const users = mentioned;
            if (quoted && !users.includes(quoted.sender.jid))
                users.push(quoted.sender.jid);
            if (users.length <= 0)
                return void reply('Tag or quote a user to ban with the reason');
            const { ban } = await this.client.DB.getUser(users[0]);
            if (ban?.banned)
                return void reply(`🟥 *@${users[0].split('@')[0]}* is already banned by *${ban.bannedBy}* in *${ban.bannedIn} ${ban.time} (GMT)*.\n\n📮 Reason: *${ban.reason} 🗿🍷*`, 'text', undefined, undefined, undefined, [users[0]]);
            if (!context)
                return void reply(`Provide the reason to ban. Example - *${this.client.config.prefix}ban @user | reason*`);
            const reason = context.trim().split('|')[1];
            if (!reason)
                return void reply(`Provide the reason to ban. Example - *${this.client.config.prefix}ban @user | reason*`);
            const { subject } = groupMetadata;
            await this.client.DB.banUser(users[0], sender.username, subject, reason.trim());
            return void reply(`*@${users[0].split('@')[0]}* is now banned from using commands. Reason: *${reason.trim()}*`, 'text', undefined, undefined, undefined, [users[0]]);
        };
    }
};
command = __decorate([
    Command('ban', {
        description: 'Bans the tagged or quoted user',
        category: 'dev',
        usage: 'ban [tag/quote users]'
    })
], command);
export default command;
