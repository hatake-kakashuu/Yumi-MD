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
        this.execute = async (M) => {
            const pattern = /instagram\.com\/(?:(?:p|tv|reel|share\/reel))\/[\w-]+\/?/;
            const url = M.urls.find(u => pattern.test(u));
            if (!url)
                return void (await M.reply('Provide a valid Instagram post URL'));
            const result = await this.client.utils.fetch(`https://weeb-api.vercel.app/instagram?url=${encodeURIComponent(url)}`);
            if (result.error)
                return void (await M.reply('Invalid URL or Private Post'));
            for (const { url: mediaUrl, type } of result.urls) {
                const buffer = await this.client.utils.getBuffer(mediaUrl);
                await M.reply(buffer, type, undefined, undefined, result.caption);
            }
        };
    }
};
default_1 = __decorate([
    Command('instagram', {
        description: 'Download media from an Instagram post',
        category: 'media',
        usage: 'instagram [link]',
        aliases: ['igdl', 'insta'],
        exp: 25,
        cooldown: 10
    })
], default_1);
export default default_1;
