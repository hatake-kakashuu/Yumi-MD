var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import axios from 'axios';
import FormData from 'form-data';
let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (!M.quoted?.message?.imageMessage)
                return void M.reply(' Please reply to an image to remove its background');
            try {
                const buffer = await M.downloadMediaMessage(M.quoted.message);
                M.reply('🔄 Removing background using AI... This may take a moment');
                const formData = new FormData();
                formData.append('image_file', buffer, {
                    filename: 'image.jpg',
                    contentType: 'image/jpeg'
                });
                formData.append('size', 'auto');
                const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                    headers: {
                        ...formData.getHeaders(),
                        'X-Api-Key': 'HEc34i6mkknVP4AUfNYG12gJ'
                    },
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                if (!response.data || response.data.length === 0) {
                    throw new Error('Empty response from API');
                }
                return void M.reply(Buffer.from(response.data), 'image', undefined, undefined, '✅ Background removed successfully!', undefined);
            }
            catch (error) {
                console.error('Background removal error:', error);
                if (error.response?.status === 402) {
                    return void M.reply(' API quota exceeded. Try again later.');
                }
                else if (error.response?.status === 403) {
                    return void M.reply(' API error. Please try again later.');
                }
                else if (error.code === 'ECONNABORTED') {
                    return void M.reply(' Request timeout. Please try again.');
                }
                else {
                    return void M.reply(' Failed to remove background. Please try again later.');
                }
            }
        };
    }
};
command = __decorate([
    Command('removebg', {
        description: 'Remove background from images using Remove.bg API',
        category: 'utils',
        usage: 'removebg (reply to image)',
        aliases: ['nobg', 'transparentbg', 'bgremove'],
        cooldown: 15,
        exp: 10
    })
], command);
export default command;
