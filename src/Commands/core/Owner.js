var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';

let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async ({ from, sender, message }) => {
            const ownerNumber = (this.client.ownerNumber || '919389379221').replace(/[^0-9]/g, '');
            const ownerName = this.client.ownerName || '❤✨ ᴍʏ ᴍᴀsᴛᴇʀ ✨🕯';
            const vcard =
                'BEGIN:VCARD\n' +
                'VERSION:3.0\n' +
                `FN: ${ownerName}\n` +
                'ORG: Kakashi Botz. Inc.;\n' +
                `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\n` +
                'END:VCARD';
            return void (await this.client.sendMessage(
                from,
                {
                    contacts: {
                        displayName: ownerName,
                        contacts: [{ vcard }]
                    },
                    mentions: [sender.jid]
                },
                { quoted: message }
            ));
        };
    }
};

default_1 = __decorate([
    Command('owner', {
        description: 'sends bot owner number',
        category: 'core',
        aliases: ['creator'],
        usage: 'owner',
        dm: true,
        cooldown: 5,
        exp: 50
    })
], default_1);

export default default_1;
