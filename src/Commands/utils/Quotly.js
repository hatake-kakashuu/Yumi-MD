var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
import { Sticker } from 'wa-sticker-formatter';
import axios from 'axios';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const quotedMsg = M.quoted?.message;
            const quotedText = quotedMsg ? (quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || quotedMsg.imageMessage?.caption || '') : '';
            if (!context && (!M.quoted || quotedText === ''))
                return void M.reply('Provide the text you want as quotly sticker, Baka!');
            const content = context ? context.trim() : quotedText;
            let user = await this.client.DB.getUser(M.sender.jid);
            const username = user.username?.custom && user.username?.name
                ? user.username.name
                : M.sender.username;
            let pfp;
            try {
                pfp =
                    (await this.client.sock.profilePictureUrl(M.sender.jid, 'image')) ||
                        'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
            }
            catch {
                pfp = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
            }
            try {
                const json = {
                    type: 'quote',
                    format: 'png',
                    backgroundColor: '#FFFFFF',
                    width: 512,
                    height: 768,
                    scale: 2,
                    messages: [
                        {
                            entities: [],
                            avatar: true,
                            from: {
                                id: 1,
                                name: username,
                                photo: { url: pfp }
                            },
                            text: content,
                            replyMessage: {}
                        }
                    ]
                };
                const response = await axios.post('https://bot.lyo.su/quote/generate', json, {
                    headers: { 'Content-Type': 'application/json' }
                });
                const buffer = Buffer.from(response.data.result.image, 'base64');
                const sticker = new Sticker(buffer, {
                    pack: `Quotly By`,
                    author: `${username}`,
                    type: 'full',
                    categories: ['😄', '🎉'],
                    quality: 100,
                    background: 'transparent'
                });
                return void (await M.reply(await sticker.build(), 'sticker'));
            }
            catch (err) {
                console.log(err);
                return void M.reply('An error occurred. Try again later');
            }
        };
    }
};
default_1 = __decorate([
    Command('quotly', {
        description: 'Telegram quotly bot it makes quote stickes.',
        category: 'utils',
        usage: 'quotly [provide text/quote message containing text]',
        aliases: ['q'],
        exp: 20,
        cooldown: 5
    })
], default_1);
export default default_1;
