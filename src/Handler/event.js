import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Welcomer = require('welcomer-gif');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const menuImagePath = path.join(__dirname, '../assets/menu.jpg');
export class EventHandler {
    constructor(client) {
        this.client = client;
        this.handleEvents = async (event) => {
            const { subject, description } = await this.client
                .loadMetadata(event.id)
                .then(({ subject, desc }) => ({ subject, description: desc || 'No Description' }))
                .catch(() => ({ subject: '__', description: '' }));
            const timestamp = new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'long'
            });
            const participantDetails = event.participants
                .map((p) => (typeof p === 'string' ? p.split('@')[0] : p?.id ? p.id.split('@')[0] : String(p)))
                .join(', ');
            const authorDetails = event.author
                ? (typeof event.author === 'string' ? event.author.split('@')[0] : event.author?.id ? event.author.id.split('@')[0] : 'Unknown')
                : 'Unknown';
            this.client.log(`${chalk.blueBright('EVENT')} ${chalk.green(`${this.client.utils.capitalize(event.action)}[${event.participants.length}]`)} in ${chalk.cyanBright(subject)}\n` +
                `${chalk.yellow('Date & Time:')} ${timestamp}\n` +
                `${chalk.magenta('Action By:')} ${authorDetails}\n` +
                `${chalk.cyan('Affected Users:')} ${participantDetails}\n` +
                `${chalk.white('Group ID:')} ${event.id}\n` +
                `${chalk.gray('-'.repeat(80))}`);
            const botJid = this.client.correctJid(this.client.user?.id || '');
            if (event.action === 'add') {
                const metadata = await this.client.groupMetadata(event.id);
                const joined = metadata.participants.some((p) => p.id === botJid);
                const justAdded = event.participants.includes(botJid);
                if (joined || justAdded) {
                    await this.sendMessageOnJoiningGroup({ subject, jid: event.id });
                    return;
                }
            }
            if (event.action === 'modify')
                console.log(event);
            const { events } = await this.client.DB.getGroup(event.id);
            if (!events ||
                (event.action === 'remove' &&
                    event.participants.includes(this.client.correctJid(this.client.user?.id || ''))))
                return void null;
            if (event.action === 'add') {
                for (const participant of event.participants) {
                    const userData = await this.client.DB.getUser(participant);
                    const isPremium = userData.premium?.active && userData.premium.expiresAt > Date.now();
                    if (isPremium && userData.vipEntry?.enabled) {
                        const pfpUrl = await this.client
                            .profilePictureUrl(participant, 'image')
                            .catch(() => 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg');
                        let mediaContent = {};
                        try {
                            if (userData.vipEntry.video) {
                                const videoUrl = `https://imgur-ibmn.onrender.com/load?url=${encodeURIComponent(userData.vipEntry.video)}`;
                                const buffer = await this.client.utils.getBuffer(videoUrl);
                                mediaContent = {
                                    video: buffer,
                                    caption: userData.vipEntry.text || `*Welcome VIP User!*`,
                                    gifPlayback: false
                                };
                            }
                            else if (userData.vipEntry.image) {
                                const imageUrl = `https://imgur-ibmn.onrender.com/load?url=${encodeURIComponent(userData.vipEntry.image)}`;
                                const buffer = await this.client.utils.getBuffer(imageUrl);
                                mediaContent = {
                                    image: buffer,
                                    caption: userData.vipEntry.text || `*Welcome VIP User!*`
                                };
                            }
                            else {
                                const username = await this.client.contact.getContact(participant).username;
                                const { tag } = await this.client.DB.getUser(participant);
                                const image = new Welcomer()
                                    .setBackground('https://i.pinimg.com/originals/07/28/dc/0728dc400eca09632215055ff003d8bf.gif')
                                    .setGIF(true)
                                    .setAvatar(pfpUrl)
                                    .setName(username)
                                    .setDiscriminator(tag);
                                mediaContent = {
                                    video: await this.client.utils.gifToMp4(await image.generate()),
                                    gifPlayback: true,
                                    caption: userData.vipEntry.text || `*Welcome VIP User!*\n\n@${participant.split('@')[0]}`
                                };
                            }
                        }
                        catch (error) {
                            const errorMessage = error instanceof Error ? error.message : String(error);
                            this.client.log(`VIP entry error for ${participant}: ${errorMessage}`);
                            mediaContent = {
                                text: userData.vipEntry.text || `*Welcome VIP User!*`
                            };
                        }
                        await this.client.sendMessage(event.id, {
                            ...mediaContent,
                            contextInfo: {
                                mentionedJid: [participant]
                            }
                        });
                        return;
                    }
                }
            }
            const text = await this.replacePlaceholders(event);
            if (event.action === 'add') {
                const user = event.participants[0];
                const username = await this.client.contact.getContact(user).username;
                const { tag } = await this.client.DB.getUser(user);
                const pfpUrl = await this.client
                    .profilePictureUrl(user, 'image')
                    .catch(() => 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg');
                const image = new Welcomer()
                    .setBackground('https://i.pinimg.com/originals/07/28/dc/0728dc400eca09632215055ff003d8bf.gif')
                    .setGIF(true)
                    .setAvatar(pfpUrl)
                    .setName(username)
                    .setDiscriminator(tag);
                return void (await this.client.sendMessage(event.id, {
                    video: await this.client.utils.gifToMp4(await image.generate()),
                    gifPlayback: true,
                    contextInfo: {
                        mentionedJid: event.participants
                    },
                    caption: `*Welcome To* ${subject} \n\n🎋 *Group Description:*\n${description}\n\nHope you follow the rules and have fun!\n\n` +
                        text
                }));
            }
            await this.client.sendMessage(event.id, {
                text,
                contextInfo: {
                    mentionedJid: [...event.participants, event.author]
                }
            });
        };
        this.replacePlaceholders = async (event) => {
            const messages = this.randomMessages[event.action];
            if (!messages || !messages.length)
                return '';
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const userMentionsArr = event.participants.map((jid) => {
                const number = jid.split('@')[0];
                return `@${number}`;
            });
            const userMentions = userMentionsArr.join(' ');
            let authorMention = '@unknown';
            if (event.author) {
                const number = event.author.split('@')[0];
                authorMention = `@${number}`;
            }
            return randomMessage.replace(/{x}/g, userMentions).replace(/{y}/g, authorMention);
        };
        this.randomMessages = {
            add: [
                '*_{x} has joined the party! Time to turn up the beats! 🎉_*',
                '*_A wild {x} appeared! Let the adventure begin! 🌟_*',
                '*_{x} hopped into the group! Let the good times roll! 🕺_*',
                '*_{x} has arrived! The party just got cooler! 🎊_*',
                '*_Welcome, {x}. Hope you brought pizza. We have the tunes covered! 🍕🎶_*',
                "*_{x} has arrived. Let's have a beer and enjoy the vibes! 🍻_*",
                '*_{x} has arrived. May I suggest a nice cold one to accompany the good times? 🥂_*',
                "*_Well, {x}, it's about time you arrived! Let's make it memorable! 🎉_*",
                '*_Um, {x} has arrived. I wonder if they brought their own cup of tea? Time to find out! ☕🎶_*',
                '*_Very funny {x}, I expected you to be here a while. Get ready for some fun! 🎊_*',
                '*_Good to see you, {x}. The party just leveled up! 🚀_*',
                "*_It's a pleasure to see you {x}. Let's make some memories! 🎉_*"
            ],
            remove: [
                '*_{x} has left the party. Until next time! 👋_*',
                "*_{x} has left the group. We'll miss you! 😢_*",
                '*_{x} has left. I hope you enjoyed your stay. Farewell! 🌟_*',
                "*_Well {x}, it's about time you left. Take care! 👋_*",
                '*_Bye {x}. Safe travels on your next adventure! 🌍_*',
                "*_It's been nice meeting you {x}. Wishing you all the best! 🌟_*",
                '*_Take care {x}. Until we meet again! 🌈_*',
                '*_Catch you later {x}. The memories linger on! 🎶_*',
                '*_{x} decided to explore the world. Safe travels! 🚀_*',
                '*_Au Revoir {x}. Until our paths cross again! 🌅_*',
                '*_Till next time {x}. Keep the memories alive! 🎉_*',
                '*_We will meet again {x}. Stay awesome! 🌟_*',
                "*_I'm looking forward to seeing you {x}. Until then, take care! 🌈_*",
                '*_I hope you brought a souvenir {x}. Your presence will be missed! 🎁_*'
            ],
            promote: [
                '*_{x}, congratulations! {y} has promoted you to admin! 🎉_*',
                "*_{x}, you've been chosen by {y} as the new admin! Lead wisely! 🏆_*",
                '*_{x} has been promoted to admin by {y}. A new era begins! ⚡_*',
                '*_{x}, welcome to the admin squad! {y} trusts you to lead well! 👑_*',
                '*_{x}, {y} just made you an admin. Power comes with responsibility! 💪_*'
            ],
            demote: [
                '*_{x}, your admin status has been revoked by {y}. Back to the fun zone! 🎭_*',
                "*_{x}, {y} decided it's time for a break from admin duties. Enjoy the freedom! 😆_*",
                "*_{x}, you've been demoted by {y}. A new journey awaits! 🚀_*",
                '*_{x}, {y} has removed your admin rights. Time to sit back and relax! 🍹_*',
                "*_{x}, the admin crown has been taken by {y}. Let's see who gets it next! 🎩_*"
            ],
            modify: []
        };
        this.sendMessageOnJoiningGroup = async (group) => {
            this.client.log(`${chalk.blueBright('JOINED')} ${chalk.cyanBright(group.subject)}`);
            try {
                const image = fs.existsSync(menuImagePath)
                    ? fs.readFileSync(menuImagePath)
                    : await this.client.utils.getBuffer('https://i.pinimg.com/736x/fe/3f/fc/fe3ffcf3e8959593787bbdf3af9ed010.jpg');
                const caption = `💗✨ Thanks for adding me to *${group.subject || 'this group'}* ✨💗\n\n` +
                    `Use *${this.client.config.prefix}help* to get started 🌸\n\n` +
                    `🌷 *Starter Commands:*\n` +
                    `✨ ${this.client.config.prefix}daily\n` +
                    `✨ ${this.client.config.prefix}bonus\n` +
                    `✨ ${this.client.config.prefix}weekly\n` +
                    `✨ ${this.client.config.prefix}wallet`;
                await this.client.sendMessage(group.jid, { image, caption });
            } catch {
                await this.client.sendMessage(group.jid, {
                    text: `💗✨ Thanks for adding me! Use *${this.client.config.prefix}help* to see all commands. 🌸`
                });
            }
        };
    }
}
