var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
import axios from 'axios';
let WebScreenshotCommand = class WebScreenshotCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (msg, args) => {
            let url = args.context.trim();
            if (!url) {
                await msg.reply('Please provide a valid URL.');
                return;
            }
            if (!/^https?:\/\//i.test(url)) {
                url = `https://${url}`;
            }
            const screenshotUrl = `https://image.thum.io/get/fullpage/${url}`;
            try {
                const response = await axios.get(screenshotUrl, { responseType: 'arraybuffer' });
                if (response.status !== 200) {
                    throw new Error(`Thum.io API returned status ${response.status}`);
                }
                const imageBuffer = Buffer.from(response.data, 'binary');
                await msg.reply(imageBuffer, 'image', false, 'image/png', `There You Go ☺❤`);
            }
            catch (error) {
                await msg.reply(`Failed to get screenshot: ${error.response?.status || error.message}`);
            }
        };
    }
};
WebScreenshotCommand = __decorate([
    Command('webss', {
        description: 'Takes a screenshot of a given website',
        category: 'utils',
        aliases: ['screenshot', 'ss'],
        exp: 10,
        cooldown: 5,
        react: '🌐',
        usage: 'webss <url>'
    })
], WebScreenshotCommand);
export default WebScreenshotCommand;
