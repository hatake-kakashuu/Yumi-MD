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
            const { jid } = M.sender;
            const cooldownTime = 15 * 60 * 1000;
            const user = await this.client.DB.getUser(jid);

            if (user.wallet <= -10000)
                return void M.reply("💀 *You are heavily in debt!* Pay off your loans before attempting any heists.");

            if (Date.now() - (user.lastRob || 0) < cooldownTime) {
                const remaining = Math.ceil((cooldownTime - (Date.now() - user.lastRob)) / 60000);
                return void M.reply(`⏳ *Police are on high alert!* Lay low for *${remaining} more minute(s)*.`);
            }

            const target = M.quoted ? M.quoted.sender.jid : M.mentioned[0];
            if (!target || target === jid)
                return void M.reply('🥷 *Tag or quote the user you want to rob!*');

            const victim = await this.client.DB.getUser(target);
            if (victim.wallet < 3000)
                return void M.reply("💸 *Target is too broke!* They don't even have 3,000 Yen in their wallet.");

            await this.client.DB.updateUser(jid, 'lastRob', 'set', Date.now());

            const success = Math.random() < 0.45;
            const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);
            const targetAmount = Math.min(rand(1000, Math.floor(victim.wallet * 0.4)), 15000);
            const penaltyAmount = Math.max(1500, Math.min(8000, Math.floor((user.wallet || 0) * 0.3) + 2000));

            const u = M.sender.username || jid.split('@')[0];
            const t = victim.wpname || target.split('@')[0];

            if (success) {
                await this.client.DB.setMoney(jid, targetAmount);
                await this.client.DB.setMoney(target, -targetAmount);

                const winMessages = [
                    `🥷 [ *SUCCESSFUL HEIST* ] 🥷\n\n*@${u}* successfully pickpocketed *¥${targetAmount.toLocaleString()}* Yen from *@${t}*! 💴`,
                    `💰 [ *HEIST VICTORY* ] 💰\n\n*@${u}* ambushed *@${t}* in an alley and escaped with *¥${targetAmount.toLocaleString()}* Yen! 💨`,
                    `🕵️ [ *CLEAN GETAWAY* ] 🕵️\n\n*@${u}* pulled off a smooth robbery against *@${t}* and looted *¥${targetAmount.toLocaleString()}* Yen!`
                ];
                const msg = winMessages[Math.floor(Math.random() * winMessages.length)];
                return void (await this.client.sendMessage(M.from, { text: msg, mentions: [jid, target] }, { quoted: M.message }));
            } else {
                await this.client.DB.setMoney(jid, -penaltyAmount);
                await this.client.DB.setMoney(target, penaltyAmount);

                const loseMessages = [
                    `🚨 [ *HEIST BUSTED* ] 🚨\n\n*@${u}* got caught red-handed! Police fined them *¥${penaltyAmount.toLocaleString()}* Yen, handed over to *@${t}*! 👮`,
                    `💥 [ *COUNTER ATTACK* ] 💥\n\n*@${t}* defended themselves with martial arts! *@${u}* dropped *¥${penaltyAmount.toLocaleString()}* Yen while fleeing! 🤕`,
                    `🔒 [ *ARRESTED* ] 🔒\n\nSecurity intercepted *@${u}*! They had to pay *¥${penaltyAmount.toLocaleString()}* Yen in restitution to *@${t}*!`
                ];
                const msg = loseMessages[Math.floor(Math.random() * loseMessages.length)];
                return void (await this.client.sendMessage(M.from, { text: msg, mentions: [jid, target] }, { quoted: M.message }));
            }
        };
    }
};

command = __decorate([
    Command('rob', {
        description: 'Attempt to rob Yen from another player',
        category: 'economy',
        usage: 'rob @user',
        exp: 15,
        aliases: ['steal'],
        cooldown: 10
    })
], command);

export default command;
