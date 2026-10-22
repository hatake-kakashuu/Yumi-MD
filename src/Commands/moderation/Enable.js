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
        this.execute = async (M, { context }) => {
            const isAdmin = M.groupMetadata?.participants.find((p) => p.id === M.sender.jid)?.admin;
            if (M.message.key.remoteJid?.endsWith('@g.us') && !isAdmin && !M.sender.isMod)
                return void M.reply('🟥 *Only Admins or Mods can enable group features!*');
            if (!context) {
                let text = `🚀 *Available Features* 🚀`;
                for (const info of this.info) {
                    text += `\n\n${info.emoji} *${this.client.utils.capitalize(info.feature)}* ${info.emoji}\n📄 *Description:* ${info.description}\n🔰 *Option:* ${this.client.config.prefix}enable ${info.feature}`;
                }
                return void M.reply(text);
            }
            const feature = context.split(' ')[0].toLowerCase().trim();
            if (this.info.findIndex((x) => x.feature === feature) < 0)
                return void M.reply(`*Invalid option.* Use *${this.client.config.prefix}enable* to see all of the available features`);
            const group = await this.client.DB.getGroup(M.from);
            if (group[feature])
                return void M.reply(`🟨 *${this.client.utils.capitalize(feature)}* is already enabled, Baka!`);
            await this.client.DB.updateGroup(M.from, feature, true);
            return void M.reply(`🟩 *${this.client.utils.capitalize(feature)}* is enabled.`);
        };
        this.info = [
            {
                feature: 'nsfw',
                description: 'Enables the bot to send NSFW contents in the group',
                emoji: '🍀'
            }
        ];
    }
};
command = __decorate([
    Command('enable', {
        description: 'Enables a certain feature of a group',
        category: 'moderation',
        usage: 'enable [feature]',
        dm: true,
        exp: 10,
        cooldown: 0
    })
], command);
export default command;
