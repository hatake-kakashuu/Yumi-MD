var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context)
                return void (await M.reply('What image do you want?'));
            const parts = context.trim().split('|');
            const term = parts[0];
            const amount = parseInt(parts[1]);
            if (!amount)
                return void (await M.reply(`Give me the amount too!\n\nExample: *${this.client.config.prefix}image naruto|5*`));
            if (amount > 20)
                return void (await M.reply('Max 20 images at a time.'));
            for (let i = 0; i < amount; i++) {
                const data = await this.client.utils.fetch(`https://weeb-api.vercel.app/gisearch?query=${encodeURIComponent(term)}`);
                if (!data.length)
                    return void (await M.reply('*404 Error! No results found*'));
                const buffer = await this.client.utils.getBuffer(data[Math.floor(Math.random() * data.length)]);
                await M.reply(buffer, 'image').catch(() => M.reply('An error occurred. Try again later'));
            }
        };
    }
};
default_1 = __decorate([
    Command('image', {
        description: 'Search and send images from the web.',
        category: 'media',
        usage: 'image <term>|<amount>',
        aliases: ['img'],
        exp: 15,
        cooldown: 20
    })
], default_1);
export default default_1;
