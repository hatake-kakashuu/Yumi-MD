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
            const user = await this.client.DB.getUser(M.sender.jid);
            const wallet = Math.floor(Number(user.wallet) || 0);

            if (wallet <= 0) {
                return void (await M.reply(`🟥 *Your wallet is empty!* You don't have any Yen to deposit.`));
            }

            const input = (args[0] || '').toLowerCase().trim();
            let amount = 0;

            if (input === 'all' || input === 'max') {
                amount = wallet;
            } else {
                amount = parseInt(input) || (M.numbers.length > 0 ? Number(M.numbers[0]) : 0);
            }

            if (isNaN(amount) || amount <= 0) {
                return void (await M.reply(`🟥 *Invalid amount!*\nUsage: *${this.client.prefix}deposit <amount>* or *${this.client.prefix}deposit all*`));
            }

            if (amount > wallet) {
                return void (await M.reply(`🟥 *Insufficient Yen!* You only have *¥${wallet.toLocaleString()}* in your wallet.`));
            }

            await this.client.DB.moveToBank(M.sender.jid, amount);
            const updated = await this.client.DB.getUser(M.sender.jid);

            let text = `🏦 [ *DEPOSIT SUCCESS* ] 🏦\n\n`;
            text += `✅ Successfully stored *¥${amount.toLocaleString()}* Yen in your bank vault!\n\n`;
            text += `💴 *Wallet:* ¥${Math.floor(updated.wallet).toLocaleString()}\n`;
            text += `🔒 *Bank Vault:* ¥${Math.floor(updated.bank).toLocaleString()}`;

            return void (await M.reply(text));
        };
    }
};

command = __decorate([
    Command('deposit', {
        description: 'Deposit Yen from your wallet into the bank vault',
        usage: 'deposit [amount/all]',
        cooldown: 5,
        exp: 5,
        aliases: ['dep'],
        category: 'economy'
    })
], command);

export default command;
