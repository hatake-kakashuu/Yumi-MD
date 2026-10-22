var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
let WarnCommand = class WarnCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            if (!M.groupMetadata)
                return void M.reply('*Try Again!*');
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            if (!users.length)
                return void M.reply('Please mention a user to warn.\nExample: `#warn @user Spamming`');
            const reason = args.slice(1).join(' ') || 'No reason provided';
            let text = '';
            for (const user of users) {
                if (user === M.groupMetadata.owner) {
                    text += `Cannot warn group owner: @${user.split('@')[0]}\n`;
                    continue;
                }
                const warnings = await this.client.DB.addWarning(user, M.from, reason);
                const userData = await this.client.DB.getUserWarnings(user, M.from);
                const lastReason = userData?.reasons?.slice(-1)[0] || 'No reason provided';
                if (warnings >= 3) {
                    await this.client.sock.groupParticipantsUpdate(M.from, [user], 'remove');
                    text += `🚨 User *@${user.split('@')[0]}* has received 3 warnings and has been *removed*`;
                    await this.client.DB.resetWarnings(user, M.from);
                }
                else {
                    text += `⚠️ User *@${user.split('@')[0]}* has been warned. (${warnings}/3`;
                }
            }
            return void M.reply(text, 'text', undefined, undefined, undefined, users);
        };
    }
};
WarnCommand = __decorate([
    Command('warn', {
        description: 'Warn a user with a reason. 3 warnings = auto removal.',
        category: 'moderation',
        usage: '#warn @user <reason>',
        cooldown: 5,
        exp: 10,
        adminRequired: true
    })
], WarnCommand);
export default WarnCommand;
