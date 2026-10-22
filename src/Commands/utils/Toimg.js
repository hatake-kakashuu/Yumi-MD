var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (!M.quoted || M.quoted.type !== 'stickerMessage') {
                return void M.reply('*Quote the sticker that you want to convert, Baka!*');
            }
            const buffer = await M.downloadMediaMessage(M.quoted.message);
            console.log('Buffer downloaded: ', buffer.length);
            const animated = M.quoted?.message?.stickerMessage?.isAnimated;
            try {
                let result;
                let type = 'image';
                if (animated) {
                    result = await this.client.utils.webpToMp4(buffer);
                    type = 'video';
                }
                else {
                    console.log('Converting static sticker to PNG...');
                    result = await this.client.utils.webpToPng(buffer);
                    if (!result) {
                        console.error('Failed to convert static sticker to PNG');
                        return void M.reply('Failed to convert static sticker to image. Please ensure it is a valid sticker.');
                    }
                }
                return void (await M.reply(result, type, undefined, undefined, 'Here is your converted media!'));
            }
            catch (error) {
                console.error('Error converting sticker:', error);
                return void M.reply('Failed to convert sticker. Make sure it is a valid sticker or an animated one.');
            }
        };
    }
};
command = __decorate([
    Command('img', {
        description: 'Converts sticker to image or GIF if animated',
        exp: 35,
        category: 'utils',
        aliases: ['toimg'],
        usage: 'img [quote_sticker]',
        cooldown: 2
    })
], command);
export default command;
