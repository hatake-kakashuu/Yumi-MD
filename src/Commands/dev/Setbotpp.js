var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
let SetBotPP = class SetBotPP extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            try {
                const { quoted, hasSupportedMediaMessage, reply, downloadMediaMessage, message } = M;
                if (!hasSupportedMediaMessage && !quoted)
                    return void reply('Reply to an image');
                let buffer;
                if (hasSupportedMediaMessage) {
                    buffer = await downloadMediaMessage(message.message);
                }
                else {
                    if (!quoted?.message)
                        return void reply('Reply to an image');
                    buffer = await downloadMediaMessage(quoted.message);
                }
                if (!this.client.sock.user)
                    return void reply('Bot user not initialized');
                await this.client.sock.updateProfilePicture(this.client.sock.user.id, buffer);
                return void reply('✅ Bot DP Updated');
            }
            catch (error) {
                return void M.reply(error.message);
            }
        };
    }
};
SetBotPP = __decorate([
    Command('setbotpp', {
        description: 'Sets bot profile picture',
        usage: 'setbotpp [quote image]',
        category: 'dev',
        exp: 0,
        cooldown: 10
    })
], SetBotPP);
export default SetBotPP;
