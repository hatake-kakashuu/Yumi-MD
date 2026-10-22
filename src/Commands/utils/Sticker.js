var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Sticker } from 'wa-sticker-formatter';
import { Command, BaseCommand } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { flags, context }) => {
            if (!M.hasSupportedMediaMessage && !M.quoted?.hasSupportedMediaMessage)
                return void M.reply('Do you want me to create a sticker from thin air?\n\nProvide an image/video by quoting or tagging it.');
            let buffer;
            if (M.hasSupportedMediaMessage)
                buffer = await M.downloadMediaMessage(M.message.message);
            else if (M.quoted && M.quoted.hasSupportedMediaMessage)
                buffer = await M.downloadMediaMessage(M.quoted.message);
            flags.forEach((flag) => (context = context.replace(flag, '')));
            const numbersFlag = flags.join(' ').replace(/\--/g, '').match(/\d+/g) || [];
            const parsedNumbers = numbersFlag.map(Number).filter(num => num > 0 && num <= 100);
            const quality = parsedNumbers[0] || this.getQualityFromType(flags.filter((flag) => this.qualityTypes.includes(flag))) || 50;
            const categories = this.getStickerEmojisFromCategories(flags);
            const pack = context.split('|');
            const sticker = new Sticker(buffer, {
                categories,
                pack: pack[1] ? pack[1].trim() : 'Eternal Inc 🍷',
                author: pack[2] ? pack[2].trim() : `${this.client.botName} 🍷`,
                quality,
                type: flags.includes('--c') || flags.includes('--crop') || flags.includes('--cropped')
                    ? 'crop'
                    : flags.includes('--s') || flags.includes('--stretch') || flags.includes('--stretched')
                        ? 'default'
                        : flags.includes('--circle') ||
                            flags.includes('--r') ||
                            flags.includes('--round') ||
                            flags.includes('--rounded')
                            ? 'circle'
                            : 'full'
            });
            return void (await M.reply(await sticker.build(), 'sticker'));
        };
        this.qualityTypes = ['--low', '--broke', '--medium', '--high'];
        this.getQualityFromType = (types) => {
            if (!types[0])
                return;
            for (const type of types) {
                switch (type) {
                    case '--broke':
                        return 1;
                    case '--low':
                        return 10;
                    case '--medium':
                        return 50;
                    case '--high':
                        return 100;
                }
            }
        };
        this.getStickerEmojisFromCategories = (flags) => {
            const categories = [];
            for (const flag of flags) {
                if (categories.length >= 3)
                    return categories;
                switch (flag) {
                    case '--angry':
                        categories.push('formatting emoji');
                        break;
                    case '--happy':
                        categories.push('😄');
                        break;
                    case '--sad':
                        categories.push('😭');
                        break;
                    case '--love':
                        categories.push('❤️');
                        break;
                    case '--celebrate':
                        categories.push('🎉');
                        break;
                    case '--greet':
                        categories.push('👋');
                        break;
                }
            }
            if (categories.length < 1)
                categories.push('✨', '💗');
            return categories;
        };
    }
};
default_1 = __decorate([
    Command('sticker', {
        description: 'Converts image/video/gif to sticker',
        category: 'utils',
        exp: 15,
        cooldown: 10,
        usage: 'sticker [caption/quote message containing media] [options] | <pack> | <author>',
        aliases: ['s'],
        dm: true
    })
], default_1);
export default default_1;
