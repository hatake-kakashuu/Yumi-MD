var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context)
                return void (await M.reply('Provide a query!'));
            const query = context.trim();
            await M.reply('*🤹 Searching...*');
            try {
                const { default: yts } = await import('yt-search');
                const searchRes = await yts(query);
                const videos = searchRes?.videos || [];
                if (!videos || !videos.length)
                    return void (await M.reply(`No videos found for *"${query}"*`));
                const length = Math.min(videos.length, 10);
                let text = '';
                for (let i = 0; i < length; i++)
                    text +=
                        `*#${i + 1}*\n` +
                            `🎵 *Title:* ${videos[i].title}\n` +
                            `🎬 *Channel:* ${videos[i].author?.name || 'Unknown'}\n` +
                            `⏱ *Duration:* ${videos[i].timestamp || videos[i].seconds + 's'}\n` +
                            `🔗 *URL:* ${videos[i].url}\n\n`;
                const thumb = videos[0]?.thumbnail
                    ? await this.client.utils.getBuffer(videos[0].thumbnail).catch(() => undefined)
                    : undefined;
                await M.reply(text, 'text', undefined, undefined, undefined, undefined, {
                    title: videos[0].title,
                    thumbnail: thumb,
                    mediaType: 2,
                    body: videos[0].description,
                    mediaUrl: videos[0].url
                });
            } catch (err) {
                console.error('YTSEARCH ERROR:', err);
                await M.reply(`Failed to search YouTube: ${err?.message || err}`);
            }
        };
    }
};
default_1 = __decorate([
    Command('yts', {
        description: 'Search YouTube videos',
        category: 'media',
        cooldown: 10,
        exp: 10,
        usage: 'yts [query]',
        aliases: ['ytsearch']
    })
], default_1);
export default default_1;
