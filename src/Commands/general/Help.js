var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
import { commands } from '../../Structures/decorators.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const menuImagePath = path.join(__dirname, '../../assets/menu.jpg');

function clockString(ms) {
    const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.cachedImage = null;
        this.getImage = () => {
            if (this.cachedImage) return this.cachedImage;
            try {
                if (fs.existsSync(menuImagePath)) {
                    this.cachedImage = fs.readFileSync(menuImagePath);
                    return this.cachedImage;
                }
            } catch {}
            return { url: 'https://i.pinimg.com/736x/df/e9/fc/dfe9fccb5145db766c473325f07a77ea.jpg' };
        };
        this.execute = async (M, { args }) => {
            const prefix = this.client.prefix;
            let cmds = Array.from(commands.values());

            if (M.from.endsWith('@g.us')) {
                const group = await this.client.DB.getGroup(M.from);
                if (!group.nsfw) {
                    cmds = cmds.filter((c) => c.category.toLowerCase() !== 'nsfw');
                }
            }

            const newsletterCtx = {
                forwardingScore: 3,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363373720969525@newsletter',
                    serverMessageId: 1,
                    newsletterName: '✧ 𝐄𝐭𝐞𝐫𝐧𝐚𝐥 𝐢𝐧𝐜 ✧'
                }
            };

            if (args.length) {
                const name = args[0].toLowerCase();
                const cmd = cmds.find(c => c.name === name || c.aliases.includes(name));
                if (!cmd) {
                    await M.reply(`😿 Command "${name}" not found!`);
                    return;
                }
                const detailText = `🌸 *Command:* ${cmd.name}\n` +
                    `📂 *Category:* ${cmd.category}\n` +
                    `💌 *Description:* ${cmd.description || 'No description'}\n` +
                    `📖 *Usage:* ${prefix}${cmd.usage || cmd.name}`;
                try {
                    await this.client.sendMessage(M.from, {
                        image: this.getImage(),
                        caption: detailText,
                        contextInfo: newsletterCtx
                    }, { quoted: M.message });
                } catch {
                    await M.reply(detailText);
                }
                return;
            }

            const user = await this.client.DB.getUser(M.sender.jid).catch(() => ({}));
            const level = user?.level || 1;
            const exp = user?.experience || 0;
            const wallet = Math.floor(user?.wallet || 0).toLocaleString();
            const bank = Math.floor(user?.bank || 0).toLocaleString();
            const role = M.sender.isMod
                ? 'Owner / Mod 👑'
                : level >= 50
                    ? 'Master 🌟'
                    : level >= 20
                        ? 'Elite ⚔️'
                        : level >= 5
                            ? 'Adventurer 🌸'
                            : 'Citizen 🎋';

            const uptime = clockString(process.uptime() * 1000);

            const tags = {
                general: '🌸 General',
                economy: '💴 Economy',
                games: '🎮 Games',
                media: '📥 Downloader',
                weeb: '🍙 Anime & Manga',
                utils: '🛠️ Utilities',
                fun: '🎈 Fun',
                ai: '🤖 AI & Voice',
                moderation: '🛡️ Moderation',
                core: 'ℹ️ Information',
                dev: '👑 Developer',
                nsfw: '🔞 NSFW'
            };

            const defaultMenu = {
                before: `
╭─「 ⛩️ %me 」
│ 👋 Hi, *%name*!
│ 👑 *Role:* %role
│ 🌸 *Level:* %level (%exp XP)
│ 💴 *Wallet:* ¥%wallet | 🏦 *Bank:* ¥%bank
│ ⏳ *Uptime:* %uptime | 🌐 *Mode:* %mode
│ 🍀 *Prefix:* %prefix
╰────\n`.trimStart(),
                header: '╭─「 %category 」',
                body: '│ • %cmd',
                footer: '╰────\n',
                after: `
*%me Multi-Device*
\`\`\`Use %prefixhelp <command> for details\`\`\`
`.trim()
            };

            const categoryOrder = [
                'general', 'economy', 'games', 'media', 'weeb', 'utils', 'fun', 'ai', 'moderation', 'core', 'dev', 'nsfw'
            ];

            const categoriesMap = new Map();
            for (const cmd of cmds) {
                const cat = (cmd.category || 'general').toLowerCase();
                if (!categoriesMap.has(cat)) {
                    categoriesMap.set(cat, []);
                }
                categoriesMap.get(cat).push(cmd);
            }

            const allCats = Array.from(categoriesMap.keys());
            allCats.sort((a, b) => {
                const idxA = categoryOrder.indexOf(a);
                const idxB = categoryOrder.indexOf(b);
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                return a.localeCompare(b);
            });

            const categorySections = allCats.map((cat) => {
                const list = categoriesMap.get(cat) || [];
                const catName = tags[cat] || this.client.utils.capitalize(cat);
                const catHeader = defaultMenu.header.replace('%category', catName);
                const catBody = list
                    .map((cmd) => defaultMenu.body.replace('%cmd', `${prefix}${cmd.name}`))
                    .join('\n');
                return `${catHeader}\n${catBody}\n${defaultMenu.footer}`;
            });

            const replace = {
                me: this.client.botName,
                name: M.sender.username || M.sender.name || 'User',
                role,
                level,
                exp,
                wallet,
                bank,
                uptime,
                mode: (this.client.mode || 'public').toUpperCase(),
                prefix
            };

            let beforeText = defaultMenu.before;
            for (const [key, val] of Object.entries(replace)) {
                beforeText = beforeText.replaceAll(`%${key}`, String(val));
            }

            let afterText = defaultMenu.after;
            for (const [key, val] of Object.entries(replace)) {
                afterText = afterText.replaceAll(`%${key}`, String(val));
            }

            const fullText = [beforeText, ...categorySections, afterText].join('\n').trim();

            try {
                await this.client.sendMessage(M.from, {
                    image: this.getImage(),
                    caption: fullText,
                    contextInfo: newsletterCtx
                }, { quoted: M.message });
            } catch {
                await M.reply(fullText);
            }
        };
    }
};
default_1 = __decorate([
    Command('help', {
        description: 'Displays command list and bot statistics',
        category: 'General',
        aliases: ['h', 'menu', '?']
    })
], default_1);
export default default_1;
