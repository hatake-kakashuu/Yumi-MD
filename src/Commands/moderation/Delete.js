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
            if (!M.quoted)
                return void M.reply('Quote the message that you want me to delete');
            const bot = this.client.sock.user?.id ? this.client.sock.user.id.split(':')[0] + '@s.whatsapp.net' : '';
            const isAdmin = M.groupMetadata?.admins?.includes(bot);
            if (M.quoted.sender.jid !== bot && !isAdmin)
                return void M.reply("Make me an admin to delete someone's message");
            return void (await this.client.sendMessage(M.from, {
                delete: M.quoted.key
            }));
        };
    }
};
command = __decorate([
    Command('delete', {
        description: 'Deletes the quoted message',
        category: 'moderation',
        usage: 'delete [quote_message]',
        exp: 10,
        cooldown: 15,
        aliases: ['del']
    })
], command);
export default command;
