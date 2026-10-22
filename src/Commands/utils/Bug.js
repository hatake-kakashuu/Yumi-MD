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
        this.execute = async ({ sender, reply }, { context }) => {
            if (!context)
                return void reply('🟥 Please provide the command name to disable.\n\nExample: *bug deck*');
            const cmd = context.toLowerCase().trim();
            const reason = 'Glitched command under review';
            const disabledCmds = await this.client.DB.getDisabledCommands();
            const decorators = await import('../../Structures/decorators.js');
            const finalCommand = decorators.commands.get(cmd) || decorators.commands.get(decorators.aliases.get(cmd) || '');
            if (!finalCommand)
                return void reply('🟨 That command does not exist.');
            const index = disabledCmds.findIndex((x) => x.command === finalCommand.name);
            if (index >= 0)
                return void reply(`🟨 *${this.client.utils.capitalize(cmd)}* is already disabled globally by *${disabledCmds[index].deniedBy}*.\n📅 Time: *${disabledCmds[index].time} (GMT)*\n📮 Reason: *${disabledCmds[index].reason}*`);
            await this.client.DB.denyCommand(finalCommand.name, reason, sender.username);
            return void reply(`🟥 *${this.client.utils.capitalize(cmd)}* command has been temporarily disabled globally by *${sender.username}*.\n\n📮 Reason: *${reason}*\n🕒 Wait until it’s fixed by the dev.`);
        };
    }
};
command = __decorate([
    Command('bug', {
        description: 'Temporarily disables a command globally if it glitches',
        category: 'utils',
        usage: 'bug [command]'
    })
], command);
export default command;
