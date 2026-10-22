var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
import { default as axios } from 'axios';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context)
                return void (await M.reply('Example:\n!lyrics alone by alan walker'));
            try {
                let track = context;
                let artist = '';
                if (context.toLowerCase().includes(' by ')) {
                    const split = context.split(/ by /i);
                    track = split[0]?.trim();
                    artist = split[1]?.trim();
                }
                const url = artist
                    ? `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`
                    : `https://lrclib.net/api/search?q=${encodeURIComponent(context)}`;
                const { data } = await axios.get(url);
                const song = Array.isArray(data) ? data[0] : data;
                if (!song)
                    return void (await M.reply('Lyrics not found'));
                const text = `🎵 *${song.trackName}*\n\n` +
                    `🎤 *Artist:* ${song.artistName}\n\n` +
                    `💿 *Album:* ${song.albumName || 'Unknown'}\n\n` +
                    `📜 *Lyrics:*\n\n${(song.plainLyrics || '').slice(0, 3500)}`;
                await M.reply(text);
            }
            catch (err) {
                console.log(err);
                await M.reply('Failed to fetch lyrics');
            }
        };
    }
};
default_1 = __decorate([
    Command('lyrics', {
        description: 'Fetch song lyrics',
        usage: 'lyrics <song> by <artist>',
        cooldown: 10,
        exp: 20,
        category: 'media'
    })
], default_1);
export default default_1;
