var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            if (!args.length)
                return void (await M.reply(`Provide two emojis to mix!\n\nExample: *${this.client.prefix}emojimix 😍+😂*`));
            const emojis = args.join('').split('+');
            const emoji1 = emojis[0];
            const emoji2 = emojis[1];
            if (!emoji2)
                return void (await M.reply(`Give me two emojis!\n\nExample: *${this.client.prefix}emojimix 😍+😂*`));
            try {
                const url = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;
                const res = await fetch(url).catch(() => null);
                const data = await res?.json();
                if (!data?.results?.length)
                    return void (await M.reply('*No Results Found - 404*'));
                const selected = data.results[Math.floor(Math.random() * data.results.length)].url;
                const img = await fetch(selected).catch(() => null);
                const buffer = img ? Buffer.from(await img.arrayBuffer()) : null;
                if (!buffer)
                    return void (await M.reply('*No Results Found - 404*'));
                const sticker = new Sticker(buffer, {
                    pack: 'EmojiMix',
                    author: `${this.client.botName} ✨`,
                    type: StickerTypes.FULL,
                    categories: ['😍', '🎉'],
                    id: '12345',
                    quality: 50,
                    background: 'transparent'
                });
                await M.reply(await sticker.toBuffer(), 'sticker');
            }
            catch (err) {
                console.log(err?.message);
                await M.reply('*No Results Found - 404*');
            }
        };
    }
};
default_1 = __decorate([
    Command('emojimix', {
        category: 'Fun',
        aliases: [],
        description: 'Mix two emojis into a sticker',
        usage: 'emojimix 😍+😂'
    })
], default_1);
export default default_1;
