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
        this.execute = async ({ reply }, { context }) => {
            if (!context)
                return void reply(`🟥 *Provide the command that you want to enable/accept globally!*\n\nExample: *${this.client.prefix}accept slot*`);
            const cmd = context.toLowerCase().trim();
            const command = commands.get(cmd) || commands.get(aliases.get(cmd) || '');
            if (!command)
                return void reply('🟨 *Provide a command which exists!*');
            const disabledCmds = await this.client.DB.getDisabledCommands();
            const index = disabledCmds.findIndex((x) => x.command === command.name);
            if (index < 0)
                return void reply(`🟨 *${this.client.utils.capitalize(command.name)}* is not in the denied list (already active globally).`);
            await this.client.DB.acceptCommand(command.name);
            return void reply(`🟩 *${this.client.utils.capitalize(command.name)}* is now re-enabled and accepted globally!`);
        };
    }
};
command = __decorate([
    Command('accept', {
        category: 'dev',
        description: 'Accepts (or enables) a command globally',
        dm: true,
        usage: 'accept [command]'
    })
], command);
export default command;
