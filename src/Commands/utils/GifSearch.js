var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context)
                return void (await M.reply('Sorry you did not give any search term!'));
            const data = await this.client.utils.fetch(`https://g.tenor.com/v1/search?q=${context}&key=LIVDSRZULELA&limit=8`);
            const video = await this.client.utils.getBuffer(data.results?.[Math.floor(Math.random() * data.results.length)]?.media[0]?.mp4?.url);
            return void (await M.reply(video, 'video', true, undefined, `Here you go`, undefined));
        };
    }
};
default_1 = __decorate([
    Command('gifsearch', {
        aliases: ['gify'],
        description: 'Sends a gif of a given topic',
        category: 'utils',
        usage: 'gify [query]',
        exp: 10
    })
], default_1);
export default default_1;
