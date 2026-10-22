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
        this.execute = async ({ from, reply, groupMetadata }) => {
            if (!groupMetadata)
                return void reply('*Try Again!*');
            const { announce } = groupMetadata;
            if (!announce)
                return void reply('Group already opened.');
            return void (await this.client.sock.groupSettingUpdate(from, 'not_announcement'));
        };
    }
};
command = __decorate([
    Command('open', {
        description: '',
        adminRequired: true,
        category: 'moderation',
        usage: 'open',
        exp: 5,
        cooldown: 10
    })
], command);
export default command;
