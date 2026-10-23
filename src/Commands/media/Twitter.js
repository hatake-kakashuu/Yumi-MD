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
            const pattern = /(twitter|x)\.com\/.*\/status\/\d+/i;
            const url = M.urls.find(u => pattern.test(u));
            if (!url)
                return void (await M.reply('Provide a valid Twitter/X post URL'));

            try {
                await M.reply('⏳ Fetching Twitter/X media...');
                let mediaList = [];
                let caption = '';

                // 1. Try Astronic API
                try {
                    const astronicUrl = `${config.astronicApiUrl || 'https://astronic-api.vercel.app'}/api/v1/twitter?url=${encodeURIComponent(url)}`;
                    const resp = await axios.get(astronicUrl, {
                        headers: { 'X-API-Key': config.astronicApiKey || 'ak_astronic_2d4c5977bf9a69fe898e5baf437aa7ddb846a184' },
                        timeout: 25000
                    });
                    if (resp.data?.status === 'success') {
                        caption = resp.data.title || resp.data.description || 'Twitter/X Post';
                        const items = resp.data.media || [];
                        if (resp.data.video_hd_url || resp.data.video_url) {
                            mediaList.push({
                                url: resp.data.video_hd_url || resp.data.video_url,
                                type: 'video'
                            });
                        } else {
                            for (const item of items) {
                                if (item.url || item.download_url) {
                                    mediaList.push({
                                        url: item.download_url || item.url,
                                        type: item.type === 'image' ? 'image' : 'video'
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {
                    // fallback
                }

                // 2. Fallback to weeb-api
                if (!mediaList.length) {
                    const fallback = await this.client.utils.fetch(`https://weeb-api.vercel.app/twitter?url=${encodeURIComponent(url)}`).catch(() => null);
                    if (fallback && !fallback.error && Array.isArray(fallback.urls)) {
                        caption = fallback.caption || caption;
                        for (const item of fallback.urls) {
                            if (item.url) {
                                mediaList.push({
                                    url: item.url,
                                    type: item.type === 'image' ? 'image' : 'video',
                                    isGif: item.quality === 'gif'
                                });
                            }
                        }
                    }
                }

                if (!mediaList.length)
                    return void (await M.reply('No downloadable media found in this tweet.'));

                for (const media of mediaList) {
                    try {
                        const buffer = await this.client.utils.getBuffer(media.url);
                        await M.reply(buffer, media.type, Boolean(media.isGif), undefined, caption);
                    } catch (err) {
                        console.error('TWITTER MEDIA SEND ERROR:', err);
                    }
                }
            } catch (err) {
                console.error('TWITTER CMD ERROR:', err);
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
