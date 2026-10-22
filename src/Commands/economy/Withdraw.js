var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';

let WithdrawCommand = class WithdrawCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            const user = await this.client.DB.getUser(M.sender.jid);
            const bank = Math.floor(Number(user.bank) || 0);

            if (bank <= 0) {
                return void (await M.reply(`🟥 *Your bank vault is empty!* You don't have any Yen deposited.`));
            }

            const input = (args[0] || '').toLowerCase().trim();
            let amount = 0;

            if (input === 'all' || input === 'max') {
                amount = bank;
            } else {
                amount = parseInt(input) || (M.numbers.length > 0 ? Number(M.numbers[0]) : 0);
            }

            if (isNaN(amount) || amount <= 0) {
                return void (await M.reply(`🟥 *Invalid amount!*\nUsage: *${this.client.prefix}withdraw <amount>* or *${this.client.prefix}withdraw all*`));
            }

            if (amount > bank) {
                return void (await M.reply(`🟥 *Insufficient Bank Balance!* You only have *¥${bank.toLocaleString()}* Yen in your bank vault.`));
            }

            await this.client.DB.moveFromBank(M.sender.jid, amount);
            const updated = await this.client.DB.getUser(M.sender.jid);

            let text = `💴 [ *WITHDRAWAL SUCCESS* ] 💴\n\n`;
            text += `✅ Successfully withdrew *¥${amount.toLocaleString()}* Yen into your pocket!\n\n`;
            text += `💴 *Wallet:* ¥${Math.floor(updated.wallet).toLocaleString()}\n`;
            text += `🔒 *Bank Vault:* ¥${Math.floor(updated.bank).toLocaleString()}`;

            return void (await M.reply(text));
        };
    }
};

WithdrawCommand = __decorate([
    Command('withdraw', {
        description: 'Withdraw Yen from your bank vault into your wallet',
        usage: 'withdraw [amount/all]',
        cooldown: 5,
        exp: 5,
        aliases: ['with'],
        category: 'economy'
    })
], WithdrawCommand);

export default WithdrawCommand;
