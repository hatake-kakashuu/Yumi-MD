var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
import axios from 'axios';
import config from '../../config.js';

const USER_AGENT =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36';

let default_1 = class extends BaseCommand {
    constructor(...args) {
        super(...args);

        this.execute = async (M, { context }) => {
            const url = context?.trim();

            if (!url) {
                return void (await M.reply(
                    'Provide a Facebook video URL!\nExample: .fbdl https://www.facebook.com/watch/?v=123'
                ));
            }

            if (
                !/^https?:\/\/(www\.|m\.|web\.)?facebook\.com\//i.test(url) &&
                !/^https?:\/\/fb\.watch\//i.test(url)
            ) {
                return void (await M.reply(
                    '⚠ Please provide a valid Facebook video URL.'
                ));
            }

            try {
                await M.reply('⏳ Fetching Facebook video...');
                let videoUrl = null;
                let title = 'Facebook Video';

                // 1. Try Astronic API first
                try {
                    const astronicUrl = `${config.astronicApiUrl || 'https://astronic-api.vercel.app'}/api/v1/facebook?url=${encodeURIComponent(url)}`;
                    const resp = await axios.get(astronicUrl, {
                        headers: {
                            'X-API-Key': config.astronicApiKey || 'ak_astronic_2d4c5977bf9a69fe898e5baf437aa7ddb846a184',
                            'User-Agent': USER_AGENT
                        },
                        timeout: 30000
                    });

                    if (resp.data?.status === 'success') {
                        title = resp.data.title || title;
                        videoUrl =
                            resp.data.video_hd_url ||
                            resp.data.video_url ||
                            resp.data.media?.find(
                                (item) => item.type === 'video' && (item.quality === 'HD' || item.quality === 'SD')
                            )?.download_url ||
                            resp.data.media?.find((item) => item.type === 'video')?.url;
                    }
                } catch (e) {
                    // fallback
                }

                // 2. Fallback to InterAPI if needed
                if (!videoUrl) {
                    const interapiKey = process.env.INTERAPI_KEY || 'ia_live_5b09f6226b185d477d82c2e03ac098edc1258ee65cbf8d95';
                    const { data } = await axios.get('https://api.interapi.dev/api/v1/facebook', {
                        params: { url },
                        headers: {
                            'X-API-Key': interapiKey,
                            'User-Agent': USER_AGENT
                        },
                        timeout: 45000
                    }).catch(() => ({ data: null }));

                    if (data?.status === 'success') {
                        title = data.title || title;
                        videoUrl =
                            data.video_hd_url ||
                            data.video_url ||
                            data.media?.find(
                                (item) => item.type === 'video' && (item.quality === 'HD' || item.quality === 'SD')
                            )?.download_url ||
                            data.media?.find((item) => item.type === 'video')?.url;
                    }
                }

                if (!videoUrl) {
                    return void (await M.reply(
                        '⚠ Could not download video. The post may be private, restricted, or deleted.'
                    ));
                }

                const videoResponse = await axios.get(videoUrl, {
                    responseType: 'arraybuffer',
                    timeout: 120000,
                    maxContentLength: 95 * 1024 * 1024,
                    headers: {
                        'User-Agent': USER_AGENT,
                        Referer: 'https://www.facebook.com/'
                    }
                });

                const videoBuffer = Buffer.from(videoResponse.data);
                if (!videoBuffer.length) {
                    return void (await M.reply('⚠ The downloaded video is empty.'));
                }

                await M.reply(
                    videoBuffer,
                    'video',
                    undefined,
                    'video/mp4',
                    title,
                    undefined,
                    undefined,
                    undefined
                );
            } catch (err) {
                console.error('[FBDL ERROR]', err?.message);
                await M.reply(`⚠ Download failed: ${err?.message || 'Unknown error'}`);
            }
        };
    }
};

default_1 = __decorate([
    Command('fbdl', {
        description: 'Downloads a Facebook video',
        cooldown: 15,
        exp: 35,
        category: 'media',
        usage: 'fbdl [Facebook URL]',
        aliases: ['fb']
    })
], default_1);

export default default_1;
