var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { delay } from '@whiskeysockets/baileys';
import { BaseCommand, Command } from '../../Structures/index.js';

let BroadcastCommand = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const quotedContent = M.quoted?.content || (typeof M.quoted?.message === 'string' ? M.quoted.message : (M.quoted?.message?.conversation || M.quoted?.message?.extendedTextMessage?.text || ''));
            if (!context && !quotedContent) {
                return void M.reply('🟥 *Provide the text to be broadcasted*');
            }

            let caption = context || quotedContent;
            let buffer;
            let type = 'text';

            try {
                if (M.hasSupportedMediaMessage) {
                    type = M.type.replace('Message', '');
                    buffer = await M.downloadMediaMessage(M.message.message);
                } else if (M.quoted && M.quoted.hasSupportedMediaMessage) {
                    type = M.quoted.type.replace('Message', '');
                    buffer = await M.downloadMediaMessage(M.quoted.message);
                }

                if (buffer && buffer.length > 10 * 1024 * 1024) {
                    return void M.reply('🟥 *Media too large. Max 10MB allowed.*');
                }
            } catch (err) {
                console.error('Media download failed:', err);
                return void M.reply('🟥 *Failed to download media.*');
            }

            const groups = await this.client.getAllGroups();
            if (!groups.length) {
                return void M.reply('🟥 *No groups found to broadcast.*');
            }

            await M.reply(`🚀 *Broadcasting to ${groups.length} groups...*`);

            const botName = this.client.botName || 'Yumi';
            const text = `📢 *[ ${botName} Official Broadcast ]*\n\n${caption}\n\n*Author:* *${M.sender.username || M.sender.name || 'Owner'}*`;
            let success = 0;
            let failed = 0;

            for (const group of groups) {
                await delay(2000);
                try {
                    const metadata = await this.client.loadMetadata(group);
                    const participants = metadata?.participants || [];

                    const content = {
                        [type]: type === 'text' ? text : buffer,
                        caption: type === 'text' ? undefined : text,
                        gifPlayback: type === 'video' ? true : undefined,
                        mentions: participants.map((p) => (typeof p === 'string' ? p : p.id))
                    };

                    await this.client.sendMessage(group, content);
                    success++;
                } catch (err) {
                    console.error(`Failed for group ${group}:`, err);
                    failed++;
                    continue;
                }
            }

            return void M.reply(`✅ *Broadcast Completed!*\n\n✔️ Success: ${success}\n🔻 Failed: ${failed}`);
        };
    }
};

BroadcastCommand = __decorate([
    Command('broadcast', {
        description: 'broadcasts announcements in groups',
        aliases: ['bc'],
        category: 'dev',
        usage: 'broadcast [text/quote or caption with media]'
    })
], BroadcastCommand);

export default BroadcastCommand;
