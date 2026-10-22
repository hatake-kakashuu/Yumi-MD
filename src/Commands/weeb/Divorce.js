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
        this.execute = async ({ sender, reply }) => {
            const { haigusha } = await this.client.DB.getUser(sender.jid);
            if (!haigusha.married)
                return void reply("You aren't married to anyone.");
            const spouseName = haigusha.data?.name || 'your spouse';
            haigusha.married = false;
            haigusha.data = {
                name: '',
                original_name: undefined,
                age: undefined,
                husbando: false,
                series: {
                    name: ''
                },
                appearances: [],
                description: '',
                display_picture: '',
                slug: ''
            };
            await this.client.DB.updateUser(sender.jid, 'haigusha', 'set', haigusha);
            return void (await reply(`💔 You divorced *${spouseName}*.`));
        };
    }
};
command = __decorate([
    Command('divorce', {
        description: 'Divorce married haigusha',
        cooldown: 45,
        exp: 10,
        category: 'weeb',
        usage: 'divorce'
    })
], command);
export default command;
