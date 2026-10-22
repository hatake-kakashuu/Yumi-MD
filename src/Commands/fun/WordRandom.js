var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import axios from 'axios';
let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            try {
                const response = await axios.get('https://random-words-api.kushcreates.com/api?language=en&length=25&words=1');
                const wordData = response.data[0];
                const text = `🎲 *Random Word* 🎲\n\n` +
                    `🔤 *Word:* ${wordData.word}\n` +
                    `📏 *Length:* ${wordData.length} characters\n` +
                    `🏷️ *Category:* ${wordData.category}\n` +
                    `🌐 *Language:* ${wordData.language}\n\n` +
                    `✨ *Have fun with your new word!*`;
                return void M.reply(text);
            }
            catch (error) {
                console.error('Random Word API Error:', error);
                return void M.reply(' Failed to fetch a random word. Please try again later.');
            }
        };
    }
};
command = __decorate([
    Command('randomword', {
        description: 'Get a random word with its details',
        category: 'fun',
        usage: 'randomword',
        aliases: ['rword', 'word'],
        cooldown: 10,
        exp: 5
    })
], command);
export default command;
