var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YT } from '../../lib/index.js';
import { BaseCommand, Command } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const url = M.urls.find(u => u.includes('youtu.be') || u.includes('youtube.com'));
            if (!url)
                return void (await M.reply('Provide a YouTube video URL'));
            const yt = new YT(url, 'audio');
            if (!(await yt.validate()))
                return void (await M.reply('*Provide a valid YouTube video URL*'));
            const raw = await yt.download();
            const audio = await this.client.utils.mp3ToOpus(raw);
            await M.reply(audio, 'audio');
        };
    }
};
default_1 = __decorate([
    Command('yta', {
        description: 'Download a YouTube video and send it as audio',
        exp: 30,
        category: 'media',
        usage: 'yta [YouTube URL]',
        cooldown: 30,
        aliases: ['ytaudio']
    })
], default_1);
export default default_1;
