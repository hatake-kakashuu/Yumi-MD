var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
import { commands, aliases } from '../../Structures/decorators.js';
let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async ({ sender, reply }, { context }) => {
            if (!context) {
                const disabledCmds = await this.client.DB.getDisabledCommands();
                if (!disabledCmds || !disabledCmds.length) {
                    return void reply(`✅ *No commands are currently denied globally!*\n\nUsage: *${this.client.prefix}deny <command> | <reason>*`);
                }
                let text = `🚫 *Globally Denied Commands:*\n\n`;
                disabledCmds.forEach((item, i) => {
                    text += `${i + 1}. *${this.client.prefix}${item.command}*\n   📮 *Reason:* ${item.reason}\n   👤 *By:* ${item.deniedBy}\n\n`;
                });
                text += `💡 Use *${this.client.prefix}accept <command>* to re-enable a command.`;
                return void reply(text);
            }
            const terms = context.trim().split('|');
            const cmd = terms[0].toLowerCase().trim();
            const reason = (terms[1] || 'Under maintenance').trim();
            const command = commands.get(cmd) || commands.get(aliases.get(cmd) || '');
            if (!command)
                return void reply('🟨 *Provide a command which exists!*');
            if (command.category === 'dev')
                return void reply('⚠️ *Developer commands cannot be denied!*');
            const disabledCmds = await this.client.DB.getDisabledCommands();
            const index = disabledCmds.findIndex((x) => x.command === command.name);
            if (index >= 0)
                return void reply(`🟨 *${this.client.utils.capitalize(command.name)}* is already denied globally.\n\n📮 Reason: *${disabledCmds[index].reason}*`);
            await this.client.DB.denyCommand(command.name, reason, sender.username);
            return void reply(`🟩 *${this.client.utils.capitalize(command.name)}* is now denied globally.\n\n📮 Reason: *${reason}*`);
        };
    }
};
command = __decorate([
    Command('deny', {
        description: 'Denies (or disables) a command globally',
        category: 'dev',
        dm: true,
        usage: 'deny [command]'
    })
], command);
export default command;
