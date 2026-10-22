var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import wikipedia from 'wikipedia';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context)
                return void M.reply('Provide a search term');
            const term = context.trim();
            const wiki = await wikipedia.summary(term);
            if (!wiki.description)
                return void M.reply('Could not find');
            let text = '';
            text += `*🎀 Title: ${wiki.title}*\n\n`;
            text += `*📜 Description: ${wiki.description}*\n\n`;
            text += `*🌐 URL: ${wiki.content_urls.desktop.page}*\n\n`;
            text += `*❄ Summary:* ${wiki.extract}`;
            M.reply(text);
        };
    }
};
default_1 = __decorate([
    Command('wikipedia', {
        aliases: ['wiki'],
        description: 'Will fetch the result of the given query from wikipedia',
        category: 'utils',
        usage: 'wiki [query]',
        exp: 10
    })
], default_1);
export default default_1;
