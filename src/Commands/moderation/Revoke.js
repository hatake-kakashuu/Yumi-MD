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
            await this.client.sock.groupRevokeInvite(M.from).then(() => {
                M.reply(`🟩 *Done! Group link has been reset*`);
            });
        };
    }
};
default_1 = __decorate([
    Command('revoke', {
        description: 'revoke',
        usage: 'revoke',
        category: 'moderation',
        exp: 10,
        adminRequired: true
    })
], default_1);
export default default_1;
