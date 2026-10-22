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
            const pattern = /(twitter|x)\.com\/.*\/status\/\d+/i;
            const url = M.urls.find(u => pattern.test(u));
            if (!url)
                return void (await M.reply('Provide a valid Twitter/X post URL'));
            try {
                const result = await this.client.utils.fetch(`https://weeb-api.vercel.app/twitter?url=${encodeURIComponent(url)}`);
                if (result.error)
                    return void (await M.reply("Can't access post or invalid URL"));
                if (!result.urls?.length)
                    return void (await M.reply('No downloadable media found'));
                for (const media of result.urls) {
                    try {
                        const buffer = await this.client.utils.getBuffer(media.url);
                        await M.reply(buffer, media.type, media.quality === 'gif', undefined, result.caption);
                    }
                    catch (err) {
                        console.log('TWITTER MEDIA ERROR →', err);
                    }
                }
            }
            catch (err) {
                console.log('TWITTER CMD ERROR →', err?.message);
                await M.reply('Failed to fetch Twitter/X post 😢');
            }
        };
    }
};
default_1 = __decorate([
    Command('twitter', {
        description: 'Download media from Twitter/X posts',
        category: 'media',
        usage: 'twitter [link]',
        aliases: ['tdl', 'xdl'],
        exp: 25,
        cooldown: 10
    })
], default_1);
export default default_1;
