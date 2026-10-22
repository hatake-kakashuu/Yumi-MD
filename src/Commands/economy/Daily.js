var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import { getTimezoneFromNumber } from '../../lib/timezone.js';
import moment from 'moment-timezone';

let command = class command extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const user = await this.client.DB.getUser(M.sender.jid);
            const now = Date.now();
            const oneDay = 86400000;
            const lastDaily = user.lastDaily || 0;
            const streak = user.dailyStreak || 0;

            if (now - lastDaily < oneDay) {
                const number = M.sender.jid.split('@')[0];
                const timezone = getTimezoneFromNumber(number);
                const nextClaim = moment(lastDaily + oneDay).tz(timezone);
                const formatted = nextClaim.format('hh:mm A');
                const timeLeft = lastDaily + oneDay - now;
                const duration = moment.duration(timeLeft);
                const timeStr = `*${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s*`;

                let cdText = `⏳ [ *DAILY COOLDOWN* ] ⏳\n\n`;
                cdText += `You have already collected today's allowance.\n\n`;
                cdText += `🕒 *Next Claim:* ${formatted}\n`;
                cdText += `⏳ *Time Remaining:* ${timeStr}\n`;
                cdText += `🔥 *Current Streak:* ${streak} days`;
                return void (await M.reply(cdText));
            }

            const isConsecutive = now - lastDaily < oneDay * 2;
            const newStreak = isConsecutive ? streak + 1 : 1;
            const baseReward = 2500;
            const streakBonus = (newStreak - 1) * 200;
            const reward = baseReward + streakBonus;

            await this.client.DB.updateUser(M.sender.jid, 'wallet', 'inc', reward);
            await this.client.DB.updateUser(M.sender.jid, 'dailyStreak', 'set', newStreak);
            await this.client.DB.updateUser(M.sender.jid, 'lastDaily', 'set', now);

            let text = `🌸 [ *DAILY ALLOWANCE* ] 🌸\n\n`;
            text += `🎉 *Konnichiwa!* Here is your daily stipend:\n\n`;
            text += `💴 *Reward:* +¥${reward.toLocaleString()} Yen\n`;
            text += `🔥 *Streak:* ${newStreak} Day(s) (+¥${streakBonus.toLocaleString()} bonus)\n\n`;
            text += `🎋 *Tip:* Check back every 24h to maintain your streak bonus!`;

            return void (await M.reply(text));
        };
    }
};

command = __decorate([
    Command('daily', {
        category: 'economy',
        description: 'Claim your daily Yen allowance',
        usage: 'daily',
        exp: 10,
        cooldown: 5
    })
], command);

export default command;
