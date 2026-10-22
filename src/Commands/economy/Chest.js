var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';

let BankCommand = class BankCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const user = await this.client.DB.getUser(M.sender.jid);
            const bank = Math.floor(Number(user.bank) || 0);
            const wallet = Math.floor(Number(user.wallet) || 0);

            let text = `🏦 [ *BANK VAULT* ] 🏦\n\n`;
            text += `👤 *Account Holder:* ${M.sender.username}\n`;
            text += `🏷️ *Tag:* #${user.tag || '0000'}\n\n`;
            text += `🔒 *Deposited in Vault:* ¥${bank.toLocaleString()} Yen\n`;
            text += `👛 *In Pocket (Wallet):* ¥${wallet.toLocaleString()} Yen\n\n`;
            text += `💡 *Tip:* Use *${this.client.prefix}deposit <amount>* to safely store your Yen away from robbers!`;

            await M.reply(text);
        };
    }
};

BankCommand = __decorate([
    Command('bank', {
        description: 'Check your bank vault balance',
        usage: 'bank',
        category: 'economy',
        exp: 10,
        aliases: ['chest', 'vault', 'khata'],
        cooldown: 5
    })
], BankCommand);

export default BankCommand;
