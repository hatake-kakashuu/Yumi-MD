var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
import axios from 'axios';

const API_URL = 'https://api.interapi.dev/api/v1/facebook';
const API_KEY = process.env.INTERAPI_KEY || 'ia_live_5b09f6226b185d477d82c2e03ac098edc1258ee65cbf8d95';

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

            if (!API_KEY) {
                return void (await M.reply(
                    '⚠ INTERAPI_KEY is missing from the bot environment.'
                ));
            }

            try {
                await M.reply('⏳ Fetching Facebook video...');

                const { data } = await axios.get(API_URL, {
                    params: { url },
                    headers: {
                        'X-API-Key': API_KEY,
                        'User-Agent': USER_AGENT
                    },
                    timeout: 60000
                });

                if (data?.status !== 'success') {
                    return void (await M.reply(
                        '⚠ API could not find this video.'
                    ));
                }

                const videoUrl =
                    data.video_hd_url ||
                    data.video_url ||
                    data.media?.find(
                        (item) =>
                            item.type === 'video' &&
                            (item.quality === 'HD' || item.quality === 'SD')
                    )?.download_url ||
                    data.media?.find(
                        (item) => item.type === 'video'
                    )?.url;

                if (!videoUrl) {
                    return void (await M.reply(
                        '⚠ No downloadable video URL returned by API.'
                    ));
                }

                const videoResponse = await axios.get(videoUrl, {
                    responseType: 'arraybuffer',
                    timeout: 120000,
                    maxContentLength: 100 * 1024 * 1024,
                    headers: {
                        'User-Agent': USER_AGENT,
                        Referer: 'https://www.facebook.com/'
                    }
                });

                const videoBuffer = Buffer.from(videoResponse.data);

                if (!videoBuffer.length) {
                    return void (await M.reply(
                        '⚠ The downloaded video is empty.'
                    ));
                }

                await M.reply(
                    videoBuffer,
                    'video',
                    undefined,
                    'video/mp4',
                    data.title || 'Facebook Video',
                    undefined,
                    undefined,
                    undefined
                );
            } catch (err) {
                const status = err?.response?.status;
                const apiMessage =
                    err?.response?.data?.message ||
                    err?.response?.data?.error;

                console.error(
                    '[FBDL]',
                    status || err?.code || err?.message,
                    apiMessage || ''
                );

                if (status === 401) {
                    return void (await M.reply(
                        '⚠ Invalid API key. Check INTERAPI_KEY.'
                    ));
                }

                if (status === 402) {
                    return void (await M.reply(
                        '⚠ API credits exhausted. Check your InterAPI balance.'
                    ));
                }

                if (status === 403) {
                    return void (await M.reply(
                        '⚠ Video is private or access is restricted.'
                    ));
                }

                if (status === 429) {
                    return void (await M.reply(
                        '⚠ API rate limit reached. Try again later.'
                    ));
                }

                if (status >= 500) {
                    return void (await M.reply(
                        '⚠ Facebook downloader API is temporarily unavailable.'
                    ));
                }

                await M.reply(
                    `⚠ Download failed: ${apiMessage || err.message || 'Unknown error'}`
                );
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
        usage: 'fbdl [Facebook URL]'
    })
], default_1);

export default default_1;
