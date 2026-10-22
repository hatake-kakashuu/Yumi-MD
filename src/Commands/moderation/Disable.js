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
            if (!context)
                return void M.reply('*Provide the feature that you wanna disable*');
            const feature = context.split(' ')[0].toLowerCase().trim();
            if (!this.features.includes(feature))
                return void M.reply('*Invalid option*');
            const group = await this.client.DB.getGroup(M.from);
            if (!group[feature])
                return void M.reply(`🟨 *${this.client.utils.capitalize(feature)}* is already disabled, Baka!`);
            await this.client.DB.updateGroup(M.from, feature, false);
            return void M.reply(`🟥 *${this.client.utils.capitalize(feature)}* is now disabled.`);
        };
        this.features = [
            'nsfw'
        ];
    }
};
command = __decorate([
    Command('disable', {
        description: 'Disables a feature of a group',
        category: 'moderation',
        exp: 10,
        cooldown: 10,
        usage: 'disable [feature]'
    })
], command);
export default command;
