var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { default as axios } from 'axios';
import { load } from 'cheerio';
import { BaseCommand, Command } from '../../Structures/index.js';
import config from '../../config.js';

let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
        };
        this.execute = async (M) => {
            const url = M.urls.find(u => /(tiktok\.com|vt\.tiktok\.com)/i.test(u));
            if (!url)
                return void (await M.reply('Provide a TikTok URL'));
            try {
                await M.reply('⏳ Fetching TikTok video...');
                let videoUrl = null;
                let title = 'TikTok Video';

                // 1. Try Astronic API first
                try {
                    const astronicUrl = `${config.astronicApiUrl || 'https://astronic-api.vercel.app'}/api/v1/tiktok?url=${encodeURIComponent(url)}`;
                    const resp = await axios.get(astronicUrl, {
                        headers: { 'X-API-Key': config.astronicApiKey || 'ak_astronic_2d4c5977bf9a69fe898e5baf437aa7ddb846a184' },
                        timeout: 25000
                    });
                    if (resp.data?.status === 'success') {
                        title = resp.data.title || title;
                        videoUrl = resp.data.video_hd_url || resp.data.video_url || resp.data.media?.find(m => m.type === 'video')?.url;
                    }
                } catch (e) {
                    // fallback
                }

                // 2. Fallback to scraping
                if (!videoUrl) {
                    const data = await this.onlineTTD(url);
                    if (data && !data.error && data.videoUrl) {
                        videoUrl = data.videoUrl;
                        title = data.title || title;
                    }
                }

                if (!videoUrl)
                    return void (await M.reply('Failed to download TikTok video'));

                const caption = `🎬 *Title:* ${title}\n🔗 *Source:* ${url}`;
                const video = await axios
                    .get(videoUrl, { responseType: 'arraybuffer', headers: this.headers, timeout: 60000 })
                    .then(res => Buffer.from(res.data));
                await M.reply(video, 'video', false, undefined, caption);
            }
            catch (err) {
                console.error('TIKTOK CMD ERROR →', err?.message);
                await M.reply('Failed to fetch TikTok 😢');
            }
        };
        this.onlineTTD = async (url) => {
            const axiosInstance = axios.create({ withCredentials: true, headers: this.headers });
            try {
                const { data: pageHtml } = await axiosInstance.get('https://tiktokdownload.online/id');
                const token = /s_tt\s*=\s*'([^']+)'/g.exec(pageHtml)?.[1];
                if (!token)
                    return { error: 'Token not found' };
                const postData = `id=${encodeURIComponent(url)}&locale=en&tt=${token}`;
                const { data: responseHtml } = await axiosInstance.post('https://tiktokdownload.online/abc?url=dl', postData, { headers: { ...this.headers, 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' } });
                const $ = load(responseHtml);
                return {
                    title: $('h2').text().trim(),
                    description: $('.maintext').text().trim(),
                    videoUrl: $('a.download_link.without_watermark').attr('href') || '',
                    musicLink: $('a.download_link.music').attr('href') || '',
                    siteUrl: url
                };
            }
            catch (error) {
                return { error: 'Failed' };
            }
        };
    }
};
default_1 = __decorate([
    Command('tiktok', {
        description: 'Download videos from TikTok',
        category: 'media',
        usage: 'tiktok [link]',
        aliases: ['tt'],
        exp: 30,
        cooldown: 5
    })
], default_1);
export default default_1;
