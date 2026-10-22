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
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            const lastWeekly = user.lastWeekly || 0;

            if (now - lastWeekly < oneWeek) {
                const number = M.sender.jid.split('@')[0];
                const timezone = getTimezoneFromNumber(number);
                const nextClaim = moment(lastWeekly + oneWeek).tz(timezone);
                const formatted = nextClaim.format('MMM D, hh:mm A');
                const timeLeft = lastWeekly + oneWeek - now;
                const duration = moment.duration(timeLeft);
                const timeStr = `*${Math.floor(duration.asDays())}d ${duration.hours()}h ${duration.minutes()}m*`;

                let cdText = `⏳ [ *WEEKLY COOLDOWN* ] ⏳\n\n`;
                cdText += `You have already collected your weekly stipend.\n\n`;
                cdText += `🕒 *Next Claim:* ${formatted}\n`;
                cdText += `⏳ *Time Remaining:* ${timeStr}`;
                return void (await M.reply(cdText));
            }

            const reward = 30000;
            await this.client.DB.updateUser(M.sender.jid, 'wallet', 'inc', reward);
            await this.client.DB.updateUser(M.sender.jid, 'lastWeekly', 'set', now);

            let text = `🎋 [ *WEEKLY SALARY* ] 🎋\n\n`;
            text += `🎉 You have successfully claimed your weekly allowance!\n\n`;
            text += `💴 *Reward:* +¥${reward.toLocaleString()} Yen\n`;
            text += `🏦 Store it in your bank with *${this.client.prefix}deposit* to keep it secure!`;

            return void (await M.reply(text));
        };
    }
};

command = __decorate([
    Command('weekly', {
        category: 'economy',
        description: 'Claim your weekly Yen salary',
        usage: 'weekly',
        exp: 15,
        cooldown: 5
    })
], command);

export default command;
