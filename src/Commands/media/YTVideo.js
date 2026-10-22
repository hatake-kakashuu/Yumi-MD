var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YT } from '../../lib/index.js';
import { Command, BaseCommand } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { flags }) => {
            const urls = M.urls.filter(u => u.includes('youtube.com') || u.includes('youtu.be'));
            if (!urls.length)
                return void (await M.reply('Provide a YouTube video URL'));
            const yt = new YT(urls[0]);
            if (!(await yt.validate()))
                return void (await M.reply('Invalid YouTube URL'));
            const qualityFlag = flags.find(f => f.startsWith('--quality='));
            const quality = (qualityFlag?.split('=')[1]?.toLowerCase() ?? 'medium');
            const info = await yt.getInfo().catch(() => null);
            if (!info)
                return void (await M.reply('Failed to fetch video info'));
            const { title, uploader, duration, thumbnails } = info;
            if (Number(duration) > 1800)
                return void (await M.reply('Video too long (max 30 min)'));
            const video = await yt.download(quality);
            const caption = `📗 *Title:* ${title}\n📕 *Channel:* ${uploader}\n📙 *Duration:* ${duration}s`;
            try {
                await M.reply(video, 'video', undefined, undefined, caption);
            }
            catch {
                const thumb = thumbnails?.[0]?.url
                    ? await this.client.utils.getBuffer(thumbnails[0].url).catch(() => undefined)
                    : undefined;
                if (thumb)
                    await M.reply(thumb, 'image', undefined, undefined, caption);
                await M.reply(video, 'document', undefined, 'video/mp4', undefined, undefined, undefined, thumb, `${title}.mp4`);
            }
        };
    }
};
default_1 = __decorate([
    Command('ytv', {
        description: 'Download and send a YouTube video',
        cooldown: 10,
        category: 'media',
        exp: 25,
        usage: 'ytv [link] --quality=[low/medium/high]',
        aliases: ['ytvideo']
    })
], default_1);
export default default_1;
