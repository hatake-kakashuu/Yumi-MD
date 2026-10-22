var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { default as axios } from 'axios';
import { Command, BaseCommand } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context)
                return void (await M.reply('What do you want to search on Pinterest?'));
            const args = context.trim().split('|');
            const term = args[0].trim();
            const amount = Math.min(parseInt(args[1]) || 1, 10);
            if (!term)
                return void (await M.reply('⚠️ Give a search term'));
            try {
                const images = await this.client.utils.pinterest(term);
                if (!images.length)
                    return void (await M.reply(' No results found'));
                const selected = images
                    .sort(() => Math.random() - 0.5)
                    .slice(0, amount);
                for (const img of selected) {
                    try {
                        let hd = img;
                        if (img.includes('pinimg.com')) {
                            hd = img
                                .replace('/236x/', '/originals/')
                                .replace('/474x/', '/originals/')
                                .replace('/564x/', '/originals/')
                                .replace('/736x/', '/originals/');
                        }
                        const response = await axios.get(hd, {
                            responseType: 'arraybuffer',
                            headers: { Referer: 'https://www.pinterest.com/' }
                        });
                        await this.client.sendMessage(M.from, { image: Buffer.from(response.data) }, { quoted: M.message });
                    }
                    catch (err) {
                        console.error('Pinterest Image Error:', err);
                        continue;
                    }
                }
            }
            catch (err) {
                console.error(err);
                await M.reply(' Pinterest search failed');
            }
        };
    }
};
default_1 = __decorate([
    Command('pinterest', {
        aliases: ['pin'],
        description: 'Search and send HD images from Pinterest',
        category: 'utils',
        usage: 'pinterest [query]|[amount]',
        exp: 10
    })
], default_1);
export default default_1;
