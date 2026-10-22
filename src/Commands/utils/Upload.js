var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import axios from 'axios';
import FormData from 'form-data';
import { extname } from 'path';
import { BaseCommand, Command } from '../../Structures/index.js';
let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            try {
                if (!M.quoted)
                    return void M.reply('Please reply to an image, video, audio, or document.');
                const buffer = await this.client.utils.downloadQuotedMedia(M.quoted);
                if (!buffer)
                    return void M.reply('🤖 Failed to download the media file.');
                const mime = M.quoted.message?.imageMessage?.mimetype ||
                    M.quoted.message?.videoMessage?.mimetype ||
                    M.quoted.message?.audioMessage?.mimetype ||
                    M.quoted.message?.documentMessage?.mimetype ||
                    'application/octet-stream';
                const extension = extname(M.quoted.message?.documentMessage?.fileName || '') ||
                    {
                        'image/jpeg': '.jpg',
                        'image/png': '.png',
                        'image/webp': '.webp',
                        'video/mp4': '.mp4',
                        'video/webm': '.webm',
                        'audio/ogg': '.ogg',
                        'audio/mpeg': '.mp3'
                    }[mime] ||
                    '.bin';
                const form = new FormData();
                form.append('file', buffer, {
                    filename: `upload${extension}`,
                    contentType: mime
                });
                const apiUrl = 'https://git-uploader-beige.vercel.app/api/upload';
                const { data } = await axios.post(apiUrl, form, {
                    headers: form.getHeaders(),
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity
                });
                if (!data || !data.success || !data.rawUrl)
                    return void M.reply('📤 Upload failed. Server returned an invalid response.');
                return void M.reply(`🚀 *Uploaded Successfully*\n\n🔗 *URL:* ${data.rawUrl}`);
            }
            catch (err) {
                console.log(err.response?.data || err);
                const errorMsg = err.response?.data?.error || err.message || 'Upload failed.';
                return void M.reply(`⚡ Upload failed: ${errorMsg}`);
            }
        };
    }
};
command = __decorate([
    Command('upload', {
        description: 'Upload replied media to GitShare (GitHub raw URL)',
        category: 'utils',
        usage: 'reply + upload',
        aliases: ['gitshare', 'gs', 'raw'],
        cooldown: 10,
        exp: 10
    })
], command);
export default command;
