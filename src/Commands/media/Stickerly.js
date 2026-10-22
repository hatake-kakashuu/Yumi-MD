var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import { default as axios } from 'axios';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            if (args.length < 1)
                return void (await M.reply('*Provide a search query or a Stickerly URL.*\n\nExamples:\n`stickerly anime`\n`stickerly https://sticker.ly/s/9K0SAC`'));
            const input = args.join(' ').trim();
            if (input.startsWith('http') && input.includes('sticker.ly/s/')) {
                await this.downloadStickers(M, input);
            }
            else {
                await this.searchStickers(M, input);
            }
        };
        this.searchStickers = async (M, query) => {
            try {
                const response = await axios.get(`https://api.delirius.store/search/stickerly?query=${encodeURIComponent(query)}`, { timeout: 10000 });
                if (!response.data?.status || !response.data?.data?.length)
                    return void (await M.reply('*No sticker packs found. Try a different query.*'));
                const results = response.data.data.slice(0, 10);
                let message = `*🌀 Stickerly Search: "${query}":*\n\n`;
                results.forEach((pack, i) => {
                    message +=
                        `🌀 *${i + 1}. ${pack.name}*\n` +
                            `🖌️ Author: ${pack.author}\n` +
                            `🖼️ Stickers: ${pack.sticker_count}\n` +
                            `🎴 Animated: ${pack.isAnimated ? 'Yes' : 'No'}\n` +
                            `🌐 URL: ${pack.url}\n\n`;
                });
                message += `Use *stickerly ${results[0].url}* to download a pack.`;
                await M.reply(message);
            }
            catch (error) {
                await M.reply(`*Search failed: ${error.message}*`);
            }
        };
        this.downloadStickers = async (M, url) => {
            try {
                const response = await axios.get(`https://api.delirius.store/download/stickerly?url=${encodeURIComponent(url)}`, { timeout: 10000 });
                if (!response.data?.status || !response.data?.data?.stickers)
                    return void (await M.reply('*Failed to fetch sticker pack.*'));
                const pack = response.data.data;
                const stickers = pack.stickers;
                const maxStickers = Math.min(stickers.length, 30);
                await M.reply(`*🌀 ${pack.name}*\n` +
                    `🖌️ Author: ${pack.author}\n` +
                    `🖼️ Total: ${pack.total}\n` +
                    `🎴 Animated: ${pack.isAnimated ? 'Yes' : 'No'}\n\n` +
                    `_Sending ${maxStickers} stickers..._`);
                for (let i = 0; i < maxStickers; i++) {
                    try {
                        const sticker = await new Sticker(stickers[i], {
                            pack: pack.name || 'Stickerly Pack',
                            author: pack.author || 'Stickerly',
                            type: StickerTypes.FULL,
                            categories: ['😄', '🎉'],
                            quality: pack.isAnimated ? 15 : 70,
                            background: 'transparent'
                        }).build();
                        await this.client.sendMessage(M.sender.jid, { sticker });
                    }
                    catch (err) {
                        await M.reply(`*Sticker ${i + 1} failed. Skipping...*`);
                    }
                }
                await M.reply(`*Sent ${maxStickers} stickers to your private chat!*`);
            }
            catch (error) {
                await M.reply(`*Download failed: ${error.message}*`);
            }
        };
    }
};
default_1 = __decorate([
    Command('stickerly', {
        description: 'Search or download sticker packs from Stickerly',
        category: 'media',
        usage: 'stickerly <query | url>',
        exp: 15,
        cooldown: 10
    })
], default_1);
export default default_1;
