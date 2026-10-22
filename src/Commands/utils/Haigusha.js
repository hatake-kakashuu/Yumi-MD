var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import axios from 'axios';
import { BaseCommand, Command } from '../../Structures/index.js';
let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            try {
                let data;
                if (M.text.includes('--search')) {
                    const query = M.text.split('--search')[1]?.trim();
                    if (!query)
                        return void M.reply(`Example: *${this.client.config.prefix}haigusha --search hinata hyuuga*`);
                    const queries = [
                        query,
                        query.replace(/\s+/g, '_'),
                        query.replace(/\s+/g, '%20'),
                        query.replace(/hyuga/gi, 'hyuuga'),
                        query.replace(/\s+/g, '_').replace(/hyuga/gi, 'hyuuga')
                    ];
                    let searchData = null;
                    for (const q of queries) {
                        try {
                            const searchUrl = `https://levi-inc-apis.vercel.app/api/search-haigusha?q=${q}`;
                            const search = await axios.get(searchUrl);
                            if (search.data.results?.length) {
                                searchData = search.data;
                                break;
                            }
                        }
                        catch (e) {
                        }
                    }
                    if (!searchData?.results?.length) {
                        return void M.reply('No character found 😢');
                    }
                    const result = searchData.results[0];
                    if (!result?.url) {
                        return void M.reply('Character URL missing');
                    }
                    const detailsUrl = `https://levi-inc-apis.vercel.app/api/character-details?url=${encodeURIComponent(result.url)}`;
                    const details = await axios.get(detailsUrl);
                    data = details.data;
                }
                else {
                    const res = await axios.get('https://levi-inc-apis.vercel.app/haigusha');
                    data = res.data;
                }
                if (!data) {
                    return void M.reply('No data received');
                }
                let text = `💙 *Name:* ${data.name || 'Unknown'}\n`;
                if (data.original_name)
                    text += `💚 *Original Name:* ${data.original_name}\n`;
                if (data.age)
                    text += `🍀 *Age:* ${data.age}\n`;
                if (data.birthday)
                    text += `🎂 *Birthday:* ${data.birthday}\n`;
                if (data.height)
                    text += `📏 *Height:* ${data.height}\n`;
                if (data.weight)
                    text += `⚖️ *Weight:* ${data.weight}\n`;
                if (data.blood_type)
                    text += `🩸 *Blood Type:* ${data.blood_type}\n`;
                if (data.rank)
                    text += `🏅 *Rank:* ${data.rank}\n`;
                if (data.likes)
                    text += `❤️ *Likes:* ${data.likes}\n`;
                if (data.dislikes)
                    text += `💔 *Dislikes:* ${data.dislikes}\n`;
                text += `🎀 *Gender:* ${data.husbando ? 'Male' : 'Female'}\n`;
                text += `💛 *Source:* ${data.series?.name || data.appearances?.[0]?.name || 'Unknown'}\n`;
                if (data.description)
                    text += `\n❤ *Description:*\n${String(data.description).slice(0, 800)}${String(data.description).length > 800 ? '...' : ''}`;
                if (!data.display_picture) {
                    return void M.reply(text);
                }
                const image = await this.client.utils.getBuffer(data.display_picture);
                this.handler.haigushaResponse.set(M.from, data);
                return void (await M.reply(image, 'image', undefined, undefined, text, undefined, {
                    title: data.name || 'Haigusha',
                    mediaType: 1,
                    thumbnail: image,
                    sourceUrl: data.url || 'https://myanimelist.net'
                }));
            }
            catch (err) {
                return void M.reply(`Failed to fetch haigusha 😢\n\n${err?.message || 'Unknown Error'}`);
            }
        };
    }
};
command = __decorate([
    Command('haigusha', {
        description: 'Summons an anime character to marry',
        cooldown: 15,
        exp: 20,
        category: 'utils',
        usage: 'haigusha'
    })
], command);
export default command;
