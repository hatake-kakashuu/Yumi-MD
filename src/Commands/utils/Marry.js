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
        this.execute = async ({ from, sender, reply }) => {
            if (!this.handler.haigushaResponse.has(from))
                return void reply('No haigusha summoned.');
            const summoned = this.handler.haigushaResponse.get(from);
            if (!summoned)
                return void reply('Haigusha already left.');
            const res = Array.isArray(summoned)
                ? summoned[0]
                : summoned;
            if (!res?.url)
                return void reply('Character URL missing.');
            const { haigusha } = await this.client.DB.getUser(sender.jid);
            if (haigusha.married)
                return void reply('You are already married 💍');
            const users = await this.client.DB.user.all();
            const target = res.url
                .toLowerCase()
                .replace(/\/+$/, '')
                .trim();
            for (const user of users) {
                const data = user.value?.whatsapp?.net;
                if (!data)
                    continue;
                const jid = data.jid;
                const hg = data.haigusha;
                if (jid !== sender.jid &&
                    hg?.married === true &&
                    hg?.data?.url) {
                    const marriedUrl = String(hg.data.url)
                        .toLowerCase()
                        .replace(/\/+$/, '')
                        .trim();
                    if (marriedUrl === target) {
                        return void reply(`💔 *${res.name}* is already married to *@${jid.split('@')[0]}*`, 'text', undefined, undefined, undefined, [jid]);
                    }
                }
            }
            haigusha.married = true;
            haigusha.data = res;
            await this.client.DB.updateUser(sender.jid, 'haigusha', 'set', haigusha);
            this.handler.haigushaResponse.delete(from);
            return void reply(`💍 Successfully married *${res.name}*`);
        };
    }
};
command = __decorate([
    Command('marry', {
        description: 'Marries the summoned haigusha',
        usage: 'marry',
        cooldown: 45,
        category: 'utils',
        exp: 10
    })
], command);
export default command;
