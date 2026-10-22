var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import axios from 'axios';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!this.client.config.gkey)
                return void M.reply('No google API key set');
            if (!context)
                return void M.reply('🔎 Provide a search term');
            const term = context.trim();
            await axios
                .get(`https://www.googleapis.com/customsearch/v1?q=${context}&key=AIzaSyABA9H2sDYVwY0sDE7bqYUxihdixoL3ozM&cx=baf9bdb0c631236e5`)
                .then((res) => {
                if (res.status !== 200)
                    return void M.reply(`🔍 Error: ${res.status}`);
                let result = ``;
                let index = 1;
                for (const item of res.data?.items) {
                    result += `*👾${index}.Title* : ${item.title}\n*🔗Link* : ${item.link}\n*📖Snippet* : ${item.snippet}\n\n`;
                    index++;
                }
                return void M.reply(`🔍 Result for *${term}*\n\n\n ${result}`);
            })
                .catch((err) => {
                M.reply(`🔍 Error: ${err}`);
            });
        };
    }
};
default_1 = __decorate([
    Command('google', {
        aliases: ['g', 'search'],
        description: 'Search on the web ',
        category: 'utils',
        usage: 'google [query]',
        exp: 10
    })
], default_1);
export default default_1;
