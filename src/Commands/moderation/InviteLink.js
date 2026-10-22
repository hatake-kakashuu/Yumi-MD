var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (!M.groupMetadata)
                return void M.reply('*Try Again in a group!!*');
            return void M.reply('https://chat.whatsapp.com/' + (await this.client.sock.groupInviteCode(M.from)));
        };
    }
};
default_1 = __decorate([
    Command('invitelink', {
        description: 'Get Group link',
        usage: 'invitelink',
        category: 'moderation',
        exp: 10,
        adminRequired: false
    })
], default_1);
export default default_1;
