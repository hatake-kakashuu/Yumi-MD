var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
import { YT } from '../../lib/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            try {
                if (!context)
                    return void (await M.reply('Provide a term to play!'));
                const term = context.trim();
                const { default: yts } = await import('yt-search');
                const { videos } = await yts(term);
                if (!videos || !videos.length)
                    return void (await M.reply(`No matching songs found for *"${term}"*`));
                const { title, description, thumbnail, url, timestamp, views, author } = videos[0];
                await this.client.sendMessage(M.from, {
                    image: { url: thumbnail },
                    caption: `*🎵 Title:* ${title}\n` +
                        `*👤 Channel:* ${author?.name || 'Unknown'}\n` +
                        `*⏱ Duration:* ${timestamp || 'Unknown'}\n` +
                        `*👁 Views:* ${(views || 0).toLocaleString()}\n\n` +
                        `${(description || '').slice(0, 150)}...`
                });
                const yt = new YT(url, 'audio');
                const audio = await yt.download();
                if (!audio || !audio.length)
                    throw new Error('Audio download failed');
                await M.reply(audio, 'audio', false, 'audio/mpeg');
            }
            catch (err) {
                console.error('PLAY ERROR:', err);
                await M.reply(`Play error: ${err?.message || err}`);
            }
        };
    }
};
default_1 = __decorate([
    Command('play', {
        description: 'Search and play a song from YouTube.',
        cooldown: 15,
        exp: 35,
        category: 'media',
        usage: 'play [term]'
    })
], default_1);
export default default_1;
