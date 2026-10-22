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
            if (!M.groupMetadata)
                return void M.reply('*Try Again*');
            const participants = M.groupMetadata.participants.map((x) => x.id);
            const comment = [
                'Good-bye Noobs',
                "I'm leaving this Childish group",
                "It's time to leave Goodbye hope u enjoyed my features",
                "I've to go now, everyone",
                '*Sayounara* ❤🔥'
            ];
            const text = comment[Math.floor(Math.random() * comment.length)];
            await M.reply(text, 'text', undefined, undefined, undefined, participants);
            await this.client.sock.groupLeave(M.from);
        };
    }
};
command = __decorate([
    Command('leave', {
        description: 'Make bot to leave the group',
        category: 'dev',
        usage: 'leave',
        exp: 10,
        cooldown: 5
    })
], command);
export default command;
