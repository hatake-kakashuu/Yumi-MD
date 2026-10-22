var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Sticker from 'wa-sticker-formatter';
import { BaseCommand, Command } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (!M.urls.length)
                return void (await M.reply('Telegram sticker Link?'));
            const url = M.urls.find((url) => url.includes('t.me/addstickers'));
            if (!url)
                return void (await M.reply('No telegram addstickers URLs found in your message'));
            const result = await this.client.utils.fetch(`https://weeb-api.vercel.app/telesticker?url=${url}`);
            await M.reply('Sending strickers in your private chat');
            for (const url of result.stickers) {
                await this.client.sendMessage(M.sender.jid, {
                    sticker: await new Sticker(url, {
                        pack: 'Made For You☑️',
                        author: '❤By Levi.inc❤',
                        type: 'full',
                        categories: ['😄', '🎉'],
                        quality: result.is_video ? 15 : 70,
                        background: 'transparent'
                    }).build()
                });
            }
        };
    }
};
default_1 = __decorate([
    Command('tele-sticker', {
        aliases: ['tl'],
        description: 'Convert telegram stickers into whatsapp Stickers',
        category: 'media',
        usage: 'tele-sticker [url]',
        exp: 10
    })
], default_1);
export default default_1;
