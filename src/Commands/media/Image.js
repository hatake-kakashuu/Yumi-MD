var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import axios from 'axios';
import config from '../../config.js';

let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context)
                return void (await M.reply('What image do you want? Example: .image naruto|3'));
            const parts = context.trim().split('|');
            const term = parts[0].trim();
            const amount = parseInt(parts[1]) || 1;
            if (amount > 10)
                return void (await M.reply('Max 10 images at a time.'));

            try {
                const apiUrl = `${config.astronicApiUrl || 'https://astronic-api.vercel.app'}/api/v1/google/images?q=${encodeURIComponent(term)}`;
                const resp = await axios.get(apiUrl, {
                    headers: { 'X-API-Key': config.astronicApiKey || 'ak_astronic_2d4c5977bf9a69fe898e5baf437aa7ddb846a184' },
                    timeout: 15000
                }).catch(() => null);

                let imageUrls = [];
                if (resp?.data?.results?.length) {
                    imageUrls = resp.data.results.map(r => r.image_url).filter(Boolean);
                }

                if (!imageUrls.length) {
                    const fallback = await this.client.utils.fetch(`https://weeb-api.vercel.app/gisearch?query=${encodeURIComponent(term)}`).catch(() => []);
                    if (Array.isArray(fallback) && fallback.length) {
                        imageUrls = fallback;
                    }
                }

                if (!imageUrls.length)
                    return void (await M.reply('*404 Error! No images found.*'));

                const toSend = Math.min(amount, imageUrls.length);
                for (let i = 0; i < toSend; i++) {
                    const chosen = imageUrls[i] || imageUrls[Math.floor(Math.random() * imageUrls.length)];
                    const buffer = await this.client.utils.getBuffer(chosen).catch(() => null);
                    if (buffer) {
                        await M.reply(buffer, 'image').catch(() => {});
                    }
                }
            } catch (err) {
                console.error('IMAGE CMD ERROR:', err);
                await M.reply('An error occurred fetching images. Try again later.');
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
        cooldown: 15
    })
], default_1);
export default default_1;
