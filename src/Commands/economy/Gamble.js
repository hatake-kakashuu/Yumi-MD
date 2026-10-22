var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Sticker } from 'wa-sticker-formatter';
import { BaseCommand, Command } from '../../Structures/index.js';

let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            const directions = ['left', 'right'];
            const choice = (args[0] || '').toLowerCase().trim();
            const amount = M.numbers.length > 0 ? M.numbers[0] : parseInt(args[1]);

            if (!directions.includes(choice) || isNaN(amount) || amount < 100) {
                return void M.reply(
                    `🎲 [ *COIN FLIP GAMBLE* ] 🎲\n\n` +
                    `*Usage:* ${this.client.prefix}gamble <left/right> <amount>\n` +
                    `*Example:* ${this.client.prefix}gamble right 500\n` +
                    `*Minimum Bet:* ¥100 Yen\n` +
                    `*Maximum Bet:* ¥20,000 Yen`
                );
            }

            if (amount > 20000)
                return void M.reply(`🟥 *Maximum bet limit is ¥20,000 Yen!*`);

            const { wallet } = await this.client.DB.getUser(M.sender.jid);
            if (amount > (wallet || 0))
                return void M.reply(`🟥 *Insufficient Yen!* You only have *¥${Math.floor(wallet || 0).toLocaleString()}* in your wallet.`);

            const result = directions[Math.floor(Math.random() * directions.length)];
            const won = result === choice;

            await this.client.DB.setMoney(M.sender.jid, won ? amount : -amount);
            const updated = await this.client.DB.getUser(M.sender.jid);

            const assetBuffer = this.client.assets.get(result);
            if (assetBuffer) {
                try {
                    const sticker = await new Sticker(assetBuffer, {
                        pack: `${this.client.botName} Economy`,
                        author: `${this.client.botName}`,
                        quality: 80,
                        type: 'full'
                    }).build();
                    await M.reply(sticker, 'sticker');
                } catch {}
            }

            let text = `🎲 [ *COIN RESULT* ] 🎲\n\n`;
            text += `Coin landed on: *${result.toUpperCase()}*! (Your guess: *${choice.toUpperCase()}*)\n\n`;

            if (won) {
                text += `🎉 *VICTORY!* You won *¥${amount.toLocaleString()}* Yen! 💴\n\n`;
            } else {
                text += `💔 *DEFEAT!* You lost *¥${amount.toLocaleString()}* Yen. 💸\n\n`;
            }

            text += `👛 *New Wallet:* ¥${Math.floor(updated.wallet).toLocaleString()} Yen`;
            return void (await M.reply(text));
        };
    }
};

command = __decorate([
    Command('gamble', {
        description: 'Gamble your Yen on a coin flip direction (left/right)',
        usage: 'gamble <left/right> <amount>',
        category: 'economy',
        cooldown: 10,
        exp: 15,
        casino: true,
        aliases: ['coinflip', 'cf']
    })
], command);

export default command;
