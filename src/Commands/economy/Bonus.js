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
            const bonusAmount = 50000;
            const { claimedBonus } = await this.client.DB.getUser(M.sender.jid);
            if (claimedBonus)
                return void M.reply('🟨 *You have already claimed your starter bonus!*');
            await this.client.DB.setMoney(M.sender.jid, bonusAmount);
            await this.client.DB.updateUser(M.sender.jid, 'claimedBonus', 'set', true);

            let text = `🎁 [ *STARTER BONUS* ] 🎁\n\n`;
            text += `🎉 Welcome to ${this.client.botName} Economy!\n\n`;
            text += `💴 *Granted:* +¥${bonusAmount.toLocaleString()} Yen\n`;
            text += `🎋 Try out *${this.client.prefix}daily*, *${this.client.prefix}slot*, and *${this.client.prefix}wallet*!`;

            return void (await M.reply(text));
        };
    }
};

command = __decorate([
    Command('bonus', {
        category: 'economy',
        description: 'Claim your one-time starter Yen bonus',
        usage: 'bonus',
        exp: 10,
        aliases: ['welcome', 'starter']
    })
], command);

export default command;
