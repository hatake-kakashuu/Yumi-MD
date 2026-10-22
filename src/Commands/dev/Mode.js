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
        this.execute = async (M, { args }) => {
            const currentMode = (this.client.mode || 'public').toLowerCase();
            const option = (args[0] || '').toLowerCase().trim();

            if (!option) {
                return void (await M.reply(
                    `⚙️ *Bot Mode Status*\n\n` +
                    `🌐 Current Mode: *${currentMode.toUpperCase()}*\n\n` +
                    `*Options:*\n` +
                    `• *${this.client.prefix}mode public* : Anyone can use the bot.\n` +
                    `• *${this.client.prefix}mode self* : Only owner/mods can use the bot.`
                ));
            }

            if (option === 'public') {
                if (currentMode === 'public') {
                    return void (await M.reply(`ℹ️ Bot is already in *PUBLIC* mode!`));
                }
                await this.client.setMode('public');
                return void (await M.reply(`🌐 *Bot Mode Updated*\n\nBot is now in *PUBLIC* mode. Everyone can use commands!`));
            }

            if (option === 'self' || option === 'private') {
                if (currentMode === 'self') {
                    return void (await M.reply(`ℹ️ Bot is already in *SELF* mode!`));
                }
                await this.client.setMode('self');
                return void (await M.reply(`🔒 *Bot Mode Updated*\n\nBot is now in *SELF* (Private) mode. Only the owner and moderators can use commands!`));
            }

            return void (await M.reply(`⚠️ *Invalid option!*\nUsage: *${this.client.prefix}mode public* or *${this.client.prefix}mode self*`));
        };
    }
};

command = __decorate([
    Command('mode', {
        description: 'Switches bot mode between public and self (private)',
        category: 'dev',
        aliases: ['botmode', 'worktype'],
        usage: 'mode [public/self]'
    })
], command);

export default command;
