var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import { tmpdir } from 'os';
import fse from 'fs-extra';
const { writeFile, readFile, unlink } = fse;
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.videoToMp3 = async (video) => {
            const filename = `${tmpdir()}/${Math.random().toString(36)}`;
            await writeFile(`${filename}.mp4`, video);
            await execPromise(`ffmpeg -y -i "${filename}.mp4" -codec:a libmp3lame -q:a 0 "${filename}.mp3"`);
            const buffer = await readFile(`${filename}.mp3`);
            await Promise.all([
                unlink(`${filename}.mp4`).catch(() => { }),
                unlink(`${filename}.mp3`).catch(() => { })
            ]);
            return buffer;
        };
        this.execute = async (M) => {
            let buffer;
            if (M.type === 'videoMessage' && M.message?.message) {
                buffer = await M.downloadMediaMessage(M.message.message);
            }
            else if (M.quoted && M.quoted.type === 'videoMessage' && M.quoted.message) {
                buffer = await M.downloadMediaMessage(M.quoted);
            }
            if (!buffer)
                return void (await M.reply('*Please provide a video to extract audio from.*'));
            const deaudio = await this.videoToMp3(buffer);
            const audio = await this.client.utils.mp3ToOpus(deaudio);
            await M.reply(audio, 'audio');
        };
    }
};
default_1 = __decorate([
    Command('extractaudio', {
        description: 'Extract audio from a quoted or sent video.',
        category: 'media',
        usage: 'deaudio [quote or caption a video]',
        aliases: ['deaudio'],
        exp: 20,
        cooldown: 25
    })
], default_1);
export default default_1;
