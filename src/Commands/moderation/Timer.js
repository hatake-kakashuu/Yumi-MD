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
        this.execute = async (M, { args }) => {
            const { from, reply, groupMetadata } = M;
            if (!groupMetadata)
                return void reply('*Try Again!*');
            const { announce } = groupMetadata;
            if (!announce)
                return void reply('Group is already open.');
            const duration = parseInt(args[0]);
            if (isNaN(duration) || duration <= 0) {
                return void reply('⚠️ Please provide a valid duration in minutes.\nExample: `#timer 60` (for 1 hour)');
            }
            await this.client.sock.groupSettingUpdate(from, 'not_announcement');
            reply(`✅ Group has been opened for *${duration} minutes*.`);
            setTimeout(async () => {
                const { announce } = await this.client.sock.groupMetadata(from);
                if (announce)
                    return;
                await this.client.sock.groupSettingUpdate(from, 'announcement');
                reply('⏳ Time is up! The group has been closed automatically.');
            }, duration * 60000);
        };
    }
};
command = __decorate([
    Command('timer', {
        description: 'Opens the group for a specific time and auto-closes it after.',
        adminRequired: true,
        category: 'moderation',
        usage: '#timer <minutes>',
        exp: 5,
        cooldown: 10
    })
], command);
export default command;
