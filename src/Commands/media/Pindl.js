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
    constructor(...args) {
        super(...args);
        this.execute = async (M, { args }) => {
            if (!args.length) return void (await M.reply('Provide a Pinterest URL!'));

            const url = args[0];
            if (!url.includes('pinterest.com') && !url.includes('pin.it')) {
                return void (await M.reply('Provide a valid Pinterest URL!'));
            }

            try {
                await M.reply('⏳ Fetching Pinterest media...');
                let downloaded = false;

                // 1. Try Astronic API first
                try {
                    const astronicUrl = `${config.astronicApiUrl || 'https://astronic-api.vercel.app'}/api/v1/pinterest?url=${encodeURIComponent(url)}`;
                    const resp = await axios.get(astronicUrl, {
                        headers: { 'X-API-Key': config.astronicApiKey || 'ak_astronic_2d4c5977bf9a69fe898e5baf437aa7ddb846a184' },
                        timeout: 25000
                    });

                    if (resp.data?.status === 'success') {
                        const title = resp.data.title || 'Pinterest Media';
                        const videoUrl = resp.data.video_hd_url || resp.data.video_url || resp.data.media?.find(m => m.type === 'video')?.url;

                        if (videoUrl) {
                            const res = await axios.get(videoUrl, {
                                responseType: 'arraybuffer',
                                timeout: 60000,
                                headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.pinterest.com/' }
                            });
                            await this.client.sendMessage(
                                M.from,
                                { video: Buffer.from(res.data), mimetype: 'video/mp4', caption: `✨ *${title}*` },
                                { quoted: M.message }
                            );
                            downloaded = true;
                        } else {
                            const imageUrl = resp.data.thumbnail || resp.data.media?.find(m => m.type === 'image')?.url || resp.data.media?.[0]?.url;
                            if (imageUrl) {
                                const res = await axios.get(imageUrl, {
                                    responseType: 'arraybuffer',
                                    timeout: 30000,
                                    headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.pinterest.com/' }
                                });
                                await this.client.sendMessage(
                                    M.from,
                                    { image: Buffer.from(res.data), caption: `🖼️ *${title}*` },
                                    { quoted: M.message }
                                );
                                downloaded = true;
                            }
                        }
                    }
                } catch (e) {
                    // fallback
                }

                if (downloaded) return;

                // 2. Fallback to kyio.web.id
                const { data } = await axios.get(
                    `https://api.kyio.web.id/api/v2/pinterest?url=${encodeURIComponent(url)}`,
                    { timeout: 25000 }
                );

                let mediaList = [];
                if (Array.isArray(data?.result)) {
                    mediaList = data.result;
                } else if (Array.isArray(data?.result?.result)) {
                    mediaList = data.result.result;
                } else if (Array.isArray(data?.data)) {
                    mediaList = data.data;
                } else if (Array.isArray(data?.data?.result)) {
                    mediaList = data.data.result;
                } else if (Array.isArray(data)) {
                    mediaList = data;
                }

                if (!mediaList.length) {
                    return void (await M.reply(data?.message || 'Failed to fetch Pinterest media.'));
                }

                const videoItem = mediaList.find(item => {
                    const q = (item?.quality || '').toLowerCase();
                    const u = item?.url || (typeof item === 'string' ? item : '');
                    return q !== 'cover' && (u.includes('.mp4') || u.includes('/videos/') || q.includes('.mp4') || q.includes('video'));
                });

                if (videoItem) {
                    const vidUrl = videoItem.url || (typeof videoItem === 'string' ? videoItem : '');
                    const res = await axios.get(vidUrl, {
                        responseType: 'arraybuffer',
                        timeout: 60000,
                        headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.pinterest.com/' }
                    });
                    return void (await this.client.sendMessage(
                        M.from,
                        { video: Buffer.from(res.data), mimetype: 'video/mp4', caption: '✨ Pinterest Video' },
                        { quoted: M.message }
                    ));
                }

                const imageItem = mediaList[0];
                const imgUrl = imageItem?.url || (typeof imageItem === 'string' ? imageItem : '');
                if (imgUrl) {
                    const res = await axios.get(imgUrl, {
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.pinterest.com/' }
                    });
                    return void (await this.client.sendMessage(
                        M.from,
                        { image: Buffer.from(res.data), caption: '🖼️ Pinterest Image' },
                        { quoted: M.message }
                    ));
                }

                return void (await M.reply('Unsupported Pinterest media.'));
            } catch (err) {
                console.error('PINDL ERROR:', err?.message);
                return void (await M.reply('Failed to download Pinterest media.'));
            }
        };
    }
};

default_1 = __decorate([
    Command('pindl', {
        description: 'Download Pinterest media',
        category: 'media',
        usage: 'pindl <url>',
        exp: 10
    })
], default_1);

export default default_1;
