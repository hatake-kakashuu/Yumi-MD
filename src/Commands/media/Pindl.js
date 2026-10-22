var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import axios from 'axios';

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
                const { data } = await axios.get(
                    `https://api.kyio.web.id/api/v2/pinterest?url=${encodeURIComponent(url)}`
                );

                if (!data || data.status === false) {
                    return void (await M.reply(data?.message || 'Failed to fetch Pinterest media.'));
                }

                let mediaList = [];
                if (Array.isArray(data.result)) {
                    mediaList = data.result;
                } else if (Array.isArray(data.result?.result)) {
                    mediaList = data.result.result;
                } else if (Array.isArray(data.data)) {
                    mediaList = data.data;
                } else if (Array.isArray(data.data?.result)) {
                    mediaList = data.data.result;
                } else if (Array.isArray(data)) {
                    mediaList = data;
                }

                if (!mediaList.length) {
                    return void (await M.reply(data?.message || 'Failed to fetch Pinterest media.'));
                }

                const getDirectUrl = (rawUrl) => {
                    try {
                        if (rawUrl.includes('dl.pincdn.app') && rawUrl.includes('token=')) {
                            const token = new URL(rawUrl).searchParams.get('token');
                            if (token) {
                                const parts = token.split('.');
                                if (parts.length >= 2) {
                                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
                                    if (payload.url) return payload.url;
                                    if (payload.cover) return payload.cover;
                                }
                            }
                        }
                    } catch {}
                    return rawUrl;
                };

                const videoItem =
                    mediaList.find((item) => {
                        const quality = (item?.quality || '').toLowerCase();
                        const raw = item?.url || (typeof item === 'string' ? item : '');
                        const resolved = getDirectUrl(raw);
                        return (
                            quality !== 'cover' &&
                            (resolved.includes('.mp4') || resolved.includes('/videos/') || raw.includes('.mp4'))
                        );
                    }) ||
                    mediaList.find((item) => {
                        const quality = (item?.quality || '').toLowerCase();
                        return (
                            quality !== 'cover' &&
                            (quality.includes('1080p') ||
                                quality.includes('720p') ||
                                quality.includes('hd') ||
                                quality.includes('video'))
                        );
                    });

                if (videoItem) {
                    const rawBest = videoItem.url || (typeof videoItem === 'string' ? videoItem : '');
                    const best = getDirectUrl(rawBest);
                    if (!best) return void (await M.reply('No downloadable video found.'));

                    let videoBuffer = null;
                    const headers = {
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
                        Referer: 'https://www.pinterest.com/'
                    };

                    try {
                        const res = await axios.get(best, {
                            responseType: 'arraybuffer',
                            headers
                        });
                        videoBuffer = Buffer.from(res.data);
                    } catch {
                        if (rawBest !== best) {
                            const res = await axios.get(rawBest, {
                                responseType: 'arraybuffer',
                                headers
                            });
                            videoBuffer = Buffer.from(res.data);
                        }
                    }

                    if (videoBuffer) {
                        return void (await this.client.sendMessage(
                            M.from,
                            {
                                video: videoBuffer,
                                mimetype: 'video/mp4',
                                caption: '✨ Pinterest Video'
                            },
                            {
                                quoted: M.message
                            }
                        ));
                    }

                    return void (await M.reply('Failed to download Pinterest video.'));
                }

                const imageItem =
                    mediaList.find((item) => (item?.quality || '').toLowerCase().includes('orig')) ||
                    mediaList.find((item) => (item?.quality || '').toLowerCase().includes('1200x')) ||
                    mediaList.find((item) => (item?.quality || '').toLowerCase().includes('image')) ||
                    mediaList[0];

                if (imageItem) {
                    const raw = imageItem.url || (typeof imageItem === 'string' ? imageItem : '');
                    const imageUrl = getDirectUrl(raw);

                    if (imageUrl) {
                        try {
                            const imgRes = await axios.get(imageUrl, {
                                responseType: 'arraybuffer',
                                headers: {
                                    'User-Agent':
                                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
                                    Referer: 'https://www.pinterest.com/'
                                }
                            });

                            return void (await this.client.sendMessage(
                                M.from,
                                {
                                    image: Buffer.from(imgRes.data),
                                    caption: '🖼️ Pinterest Image'
                                },
                                {
                                    quoted: M.message
                                }
                            ));
                        } catch {
                            return void (await this.client.sendMessage(
                                M.from,
                                {
                                    image: {
                                        url: imageUrl
                                    },
                                    caption: '🖼️ Pinterest Image'
                                },
                                {
                                    quoted: M.message
                                }
                            ));
                        }
                    }
                }

                return void (await M.reply('Unsupported Pinterest media.'));
            } catch (err) {
                console.log(err);
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
