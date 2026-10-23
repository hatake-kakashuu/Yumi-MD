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
        this.execute = async (M) => {
            const pattern = /instagram\.com\/(?:(?:p|tv|reel|share\/reel|reels))\/[\w-]+\/?/i;
            const url = M.urls.find(u => pattern.test(u));
            if (!url)
                return void (await M.reply('Provide a valid Instagram post or reel URL'));

            try {
                await M.reply('⏳ Fetching Instagram media...');
                let mediaList = [];
                let caption = '';

                try {
                    const astronicUrl = `${config.astronicApiUrl || 'https://astronic-api.vercel.app'}/api/v1/instagram?url=${encodeURIComponent(url)}`;
                    const resp = await axios.get(astronicUrl, {
                        headers: { 'X-API-Key': config.astronicApiKey || 'ak_astronic_2d4c5977bf9a69fe898e5baf437aa7ddb846a184' },
                        timeout: 25000
                    });
                    if (resp.data?.status === 'success') {
                        caption = resp.data.title || resp.data.description || 'Instagram Media';
                        const items = resp.data.media || [];
                        for (const item of items) {
                            if (item.url || item.download_url) {
                                mediaList.push({
                                    url: item.download_url || item.url,
                                    type: item.type === 'image' ? 'image' : 'video'
                                });
                            }
                        }
                    }
                } catch (e) {
                    // fallback
                }

                if (!mediaList.length) {
                    const fallback = await this.client.utils.fetch(`https://weeb-api.vercel.app/instagram?url=${encodeURIComponent(url)}`).catch(() => null);
                    if (fallback && !fallback.error && Array.isArray(fallback.urls)) {
                        caption = fallback.caption || caption;
                        for (const item of fallback.urls) {
                            if (item.url) {
                                mediaList.push({
                                    url: item.url,
                                    type: item.type === 'image' ? 'image' : 'video'
                                });
                            }
                        }
                    }
                }

                if (!mediaList.length)
                    return void (await M.reply('Failed to fetch media (post may be private or restricted).'));

                for (const media of mediaList) {
                    const buffer = await this.client.utils.getBuffer(media.url).catch(() => null);
                    if (buffer) {
                        await M.reply(buffer, media.type, undefined, undefined, caption);
                    }
                }
            } catch (err) {
                console.error('INSTA CMD ERROR:', err);
                await M.reply('Failed to download Instagram media.');
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
