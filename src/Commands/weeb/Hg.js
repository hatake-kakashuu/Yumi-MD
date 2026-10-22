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
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            while (users.length < 1)
                users.push(M.sender.jid);
            const user = users[0];
            const { haigusha, username: name } = await this.client.DB.getUser(user);
            if (!haigusha.married || !haigusha.data)
                return void M.reply(`${user === M.sender.jid
                    ? "You aren't"
                    : `*@${user.split('@')[0]}* isn't`} married`, 'text', undefined, undefined, undefined, user === M.sender.jid
                    ? undefined
                    : [user]);
            let username = this.client.contact.getContact(user)?.username || user.split('@')[0];
            if (name?.custom && name.name)
                username = name.name;
            const hg = haigusha.data;
            let text = `💍 *Married To:* ${username}\n\n`;
            text += `💙 *Name:* ${hg.name}\n`;
            if (hg.original_name)
                text += `💚 *Original Name:* ${hg.original_name}\n`;
            if (hg.age)
                text += `🍀 *Age:* ${hg.age}\n`;
            if (hg.birthday)
                text += `🎂 *Birthday:* ${hg.birthday}\n`;
            if (hg.height)
                text += `📏 *Height:* ${hg.height}\n`;
            if (hg.weight)
                text += `⚖️ *Weight:* ${hg.weight}\n`;
            if (hg.blood_type)
                text += `🩸 *Blood Type:* ${hg.blood_type}\n`;
            if (hg.rank)
                text += `🏅 *Rank:* ${hg.rank}\n`;
            if (hg.likes)
                text += `❤️ *Likes:* ${hg.likes}\n`;
            if (hg.dislikes)
                text += `💔 *Dislikes:* ${hg.dislikes}\n`;
            text += `🎀 *Gender:* ${hg.husbando ? 'Male' : 'Female'}\n`;
            text += `💛 *Source:* ${hg.series?.name ||
                hg.appearances?.[0]?.name ||
                'Unknown'}\n`;
            if (hg.description)
                text += `\n❤ *Description:*\n${hg.description.slice(0, 1000)}${hg.description.length > 1000 ? '...' : ''}`;
            try {
                const buffer = await this.client.utils.getBuffer(hg.display_picture);
                return void (await this.client.sendMessage(M.from, {
                    image: buffer,
                    caption: text,
                    contextInfo: {
                        externalAdReply: {
                            title: hg.name,
                            mediaType: 1,
                            thumbnail: buffer,
                            sourceUrl: hg.url
                        }
                    }
                }, {
                    quoted: M.message
                }));
            }
            catch {
                return void M.reply(text);
            }
        };
    }
};
command = __decorate([
    Command('hg', {
        description: "Displays user's haigusha",
        usage: 'hg [tag/reply]',
        category: 'weeb',
        cooldown: 15,
        exp: 10
    })
], command);
export default command;
