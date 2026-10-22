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
        this.execute = async (M, { context, args }) => {
            const user = await this.client.DB.getUser(M.sender.jid);
            const wallet = Math.floor(Number(user.wallet) || 0);

            const input = (args[0] || context || '').toLowerCase().trim();
            let amt = 0;
            if (input === 'all' || input === 'max') {
                amt = Math.min(wallet, 25000);
            } else {
                amt = parseInt(input) || (M.numbers.length > 0 ? Number(M.numbers[0]) : 0);
            }

            if (!amt || amt < 100)
                return void M.reply(`🟥 *Minimum bet is ¥100 Yen!*\nUsage: *${this.client.prefix}slot <amount>*`);
            if (amt > 25000)
                return void M.reply(`🟥 *Maximum bet limit is ¥25,000 Yen!*`);
            if (amt > wallet)
                return void M.reply(`🟥 *Insufficient Yen!* You only have *¥${wallet.toLocaleString()}* in your wallet.`);

            const symbols = ['🌸', '🍒', '🏮', '🎐', '💮', '⭐'];
            const pick = () => symbols[Math.floor(Math.random() * symbols.length)];

            const winChance = Math.random();
            let isJackpot = false;
            let isNormalWin = false;
            let winRow = [];

            if (winChance < 0.15) {
                const jackSym = pick();
                winRow = [jackSym, jackSym, jackSym];
                isJackpot = true;
            } else if (winChance < 0.45) {
                const mSym = pick();
                winRow = [mSym, mSym, pick()];
                isNormalWin = true;
            } else {
                winRow = [pick(), pick(), pick()];
                while (winRow[0] === winRow[1] && winRow[1] === winRow[2]) {
                    winRow[2] = pick();
                }
            }

            const grid = [
                [pick(), pick(), pick()],
                winRow,
                [pick(), pick(), pick()]
            ];

            let multiplier = 0;
            if (isJackpot) multiplier = 2.5;
            else if (isNormalWin) multiplier = 1.4;

            const isWin = isJackpot || isNormalWin;
            const netResult = isWin ? Math.floor(amt * multiplier) - amt : -amt;
            const winnings = isWin ? Math.floor(amt * multiplier) : 0;

            await this.client.DB.setMoney(M.sender.jid, netResult);
            const updated = await this.client.DB.getUser(M.sender.jid);

            let text = `🎰 [ *TOKYO SLOTS* ] 🎰\n\n`;
            text += `  [ ${grid[0].join(' | ')} ]\n`;
            text += `► [ ${grid[1].join(' | ')} ] ◄  *PAYLINE*\n`;
            text += `  [ ${grid[2].join(' | ')} ]\n\n`;

            if (isJackpot) {
                text += `🎊 *JACKPOT WINNER!* 🎊\n`;
                text += `You hit 3-in-a-row and won *¥${winnings.toLocaleString()}* Yen! 💴\n\n`;
            } else if (isNormalWin) {
                text += `🎉 *LUCKY WIN!* 🎉\n`;
                text += `You matched 2 symbols and won *¥${winnings.toLocaleString()}* Yen! 💴\n\n`;
            } else {
                text += `💔 *BET LOST!* 💔\n`;
                text += `You lost *¥${amt.toLocaleString()}* Yen. Better luck next spin!\n\n`;
            }

            text += `👛 *New Wallet:* ¥${Math.floor(updated.wallet).toLocaleString()} Yen`;
            return void M.reply(text);
        };
    }
};

default_1 = __decorate([
    Command('slot', {
        category: 'economy',
        description: 'Bet your Yen in the Tokyo lucky slot machine',
        casino: true,
        usage: 'slot <amount/all>',
        cooldown: 5,
        exp: 10,
        aliases: ['bet', 'slots']
    })
], default_1);

export default default_1;
