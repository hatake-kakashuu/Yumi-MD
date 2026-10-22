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
            try {
                const users = M.mentioned;
                if (M.quoted && !users.includes(M.quoted.sender.jid))
                    users.push(M.quoted.sender.jid);
                if (!users.length) {
                    return void (await M.reply(`🟥 *Please tag or quote a user to transfer Yen!*`));
                }
                if (users[0] === M.sender.jid) {
                    return void (await M.reply(`🟥 *You cannot transfer Yen to yourself!*`));
                }
                if (M.numbers.length < 1) {
                    return void (await M.reply(`🟥 *Please specify the amount of Yen to send.*\nExample: *${this.client.prefix}give @user 500*`));
                }
                const recipient = users[0];
                const amount = Number(M.numbers[0]);
                if (isNaN(amount) || amount <= 0) {
                    return void (await M.reply(`🟥 *Invalid amount specified.*`));
                }

                const senderData = await this.client.DB.getUser(M.sender.jid);
                if ((senderData.wallet || 0) < amount) {
                    return void (await M.reply(`🟥 *Insufficient Yen!* You only have *¥${Math.floor(senderData.wallet || 0).toLocaleString()}* Yen in your wallet.`));
                }

                await this.client.DB.transfer(M.sender.jid, recipient, amount);
                const updatedGiver = await this.client.DB.getUser(M.sender.jid);

                let text = `💸 [ *TRANSFER SUCCESSFUL* ] 💸\n\n`;
                text += `✅ You sent *¥${amount.toLocaleString()}* Yen to @${recipient.split('@')[0]}!\n\n`;
                text += `💴 *Your Wallet:* ¥${Math.floor(updatedGiver.wallet || 0).toLocaleString()} Yen`;

                await this.client.sendMessage(M.from, {
                    text,
                    mentions: [M.sender.jid, recipient]
                }, { quoted: M.message });
            }
            catch (err) {
                console.error('Give command error:', err);
                await M.reply(`🟥 *Transfer Failed:* ${err.message || 'Something went wrong.'}`);
            }
        };
    }
};

command = __decorate([
    Command('give', {
        category: 'economy',
        description: 'Transfer Yen from your wallet to another user',
        usage: 'give @user <amount>',
        exp: 15,
        aliases: ['pay', 'transfer'],
        cooldown: 5
    })
], command);

export default command;
