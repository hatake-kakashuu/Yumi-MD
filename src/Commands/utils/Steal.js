var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import { tmpdir } from 'os';
import fse from 'fs-extra';
const { writeFile, readFile, unlink } = fse;
let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { flags, context }) => {
            if (!M.quoted || M.quoted.type !== 'stickerMessage')
                return void M.reply('Sticker?');
            const pack = context.split('|');
            if (!pack[1])
                return void M.reply(`pack and author?`);
            const buffer = await M.downloadMediaMessage(M.quoted.message);
            const filename = `${tmpdir()}/${Math.random().toString(36)}.webp`;
            const getQuality = () => {
                const qualityFlag = context.match(/--(\d+)/g) || '';
                return qualityFlag.length
                    ? parseInt(qualityFlag[0].split('--')[1], 10)
                    : flags.includes('--broke')
                        ? 1
                        : flags.includes('--low')
                            ? 10
                            : flags.includes('--high')
                                ? 100
                                : 50;
            };
            let quality = getQuality();
            if (quality > 100 || quality < 1)
                quality = 50;
            flags.forEach((flag) => (context = context.replace(flag, '')));
            const getOptions = () => {
                const categories = (() => {
                    const categories = flags.reduce((categories, flag) => {
                        switch (flag) {
                            case '--angry':
                                categories.push('formatting emoji');
                                break;
                            case '--love':
                                categories.push('❤️');
                                break;
                            case '--sad':
                                categories.push('😭');
                                break;
                            case '--happy':
                                categories.push('😄');
                                break;
                            case '--greet':
                                categories.push('👋');
                                break;
                            case '--celebrate':
                                categories.push('🎉');
                                break;
                        }
                        return categories;
                    }, new Array());
                    categories.length = 2;
                    if (!categories[0])
                        categories.push('❤️', '🌹');
                    return categories;
                })();
                return {
                    categories,
                    pack: pack[1] || `Stolen By`,
                    author: pack[2] || `${M.sender.username}❤`,
                    quality,
                    type: StickerTypes[flags.includes('--crop') || flags.includes('--c')
                        ? 'CROPPED'
                        : flags.includes('--stretch') || flags.includes('--s')
                            ? 'DEFAULT'
                            : 'FULL']
                };
            };
            flags.forEach((flag) => (context = context.replace(flag, '')));
            const sticker = await new Sticker(buffer, getOptions()).build();
            await writeFile(filename, sticker);
            const result = await readFile(filename);
            await unlink(filename);
            return void (await M.reply(result, 'sticker'));
        };
    }
};
command = __decorate([
    Command('steal', {
        description: '',
        category: 'utils',
        usage: 'steal',
        exp: 10,
        cooldown: 15
    })
], command);
export default command;
