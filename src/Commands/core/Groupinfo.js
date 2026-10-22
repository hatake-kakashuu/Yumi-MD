var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Command, BaseCommand } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (!M.groupMetadata)
                return void M.reply('*Try Again*');
            const { id, subject, owner, participants, admins, desc, creation } = M.groupMetadata;
            const { nsfw } = await this.client.DB.getGroup(M.from);
            let pfpUrl;
            try {
                pfpUrl = await this.client.sock.profilePictureUrl(id, 'image');
            }
            catch {
                pfpUrl = undefined;
            }
            const pfp = pfpUrl ? await this.client.utils.getBuffer(pfpUrl) : this.client.assets.get('404');
            let text = '';
            text += `*📋ID*: ${id}\n\n`;
            text += `*🏷️Subject*: ${subject}\n\n`;
            text += `*👑Owner*: ${owner ? `@${owner.split('@')[0]}` : 'Unknown'}\n\n`;
            text += `*🗓️ Created On*: ${creation ? new Date(creation * 1000).toLocaleString() : 'Unknown'}\n\n`;
            text += `*👥Participants*: ${participants.length}\n\n`;
            text += `*🎖️Admins*: ${admins?.length ?? 0}\n\n`;
            text += `*🍀NSFW*: ${nsfw ? 'Enabled' : 'Disabled'}\n\n`;
            text += `*ℹ️ Description*: ${desc ?? 'No description available'}`;
            return void (await M.reply(pfp, 'image', undefined, undefined, text));
        };
    }
};
default_1 = __decorate([
    Command('groupinfo', {
        description: 'Get Group information',
        usage: 'groupinfo',
        category: 'core',
        exp: 10
    })
], default_1);
export default default_1;
