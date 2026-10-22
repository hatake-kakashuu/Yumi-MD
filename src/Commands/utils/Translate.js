var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import translate from 'translate-google';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context.includes('|'))
                return void M.reply(`Usage:\n${this.client.config.prefix}tr Hello|hi`);
            const [text, lang] = context.split('|').map(v => v.trim());
            if (!text)
                return void M.reply('Give text to translate.');
            if (!lang)
                return void M.reply('Give a language code. Example: hi, en, ja');
            try {
                const result = await translate(text, { to: lang });
                M.reply(`*🌍 Translation*\n\n*Text:* ${text}\n*To:* ${lang}\n\n*Result:* ${result}`);
            }
            catch {
                M.reply('Invalid language code or translation failed.');
            }
        };
    }
};
default_1 = __decorate([
    Command('translate', {
        aliases: ['tr'],
        description: 'Translate text to any language.',
        category: 'utils',
        usage: 'tr <text>|<language_code>\nExample: tr Hello|hi',
        exp: 40
    })
], default_1);
export default default_1;
