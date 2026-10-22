var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';

let WalletCommand = class WalletCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const targetJid = M.mentioned[0] || (M.quoted ? M.quoted.sender.jid : M.sender.jid);
            const user = await this.client.DB.getUser(targetJid);
            const wallet = Math.floor(Number(user.wallet) || 0);
            const bank = Math.floor(Number(user.bank) || 0);
            const netWorth = wallet + bank;
            const username = targetJid === M.sender.jid ? M.sender.username : (user.wpname || targetJid.split('@')[0]);

            let text = `🏮 [ *WALLET BALANCE* ] 🏮\n\n`;
            text += `👤 *User:* ${username}\n`;
            text += `🏷️ *Tag:* #${user.tag || '0000'}\n\n`;
            text += `💴 *Wallet:* ¥${wallet.toLocaleString()} Yen\n`;
            text += `🏦 *Bank:* ¥${bank.toLocaleString()} Yen\n`;
            text += `💰 *Net Worth:* ¥${netWorth.toLocaleString()} Yen\n\n`;
            text += `🌸 *Status:* ${wallet < 0 ? 'In Debt 💀' : wallet > 1000000 ? 'Tycoon 👑' : 'Citizen 🎋'}`;

            await M.reply(text);
        };
    }
};

WalletCommand = __decorate([
    Command('wallet', {
        description: 'Check your wallet and bank balance in Yen',
        usage: 'wallet [@user]',
        category: 'economy',
        exp: 10,
        aliases: ['bal', 'balance', 'yen', 'gembox', 'gb'],
        cooldown: 5
    })
], WalletCommand);

export default WalletCommand;
