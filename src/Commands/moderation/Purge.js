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
        this.purgeSet = new Set();
        this.execute = async (M) => {
            if (!M.groupMetadata)
                return;
            const { participants, owner } = M.groupMetadata;
            const isAdmin = participants.some((p) => p.id === M.sender.jid && (p.admin || M.sender.jid === owner));
            if (!isAdmin)
                return;
            if (this.purgeSet.has(M.from)) {
                let members = participants.map((p) => p.id).filter((id) => id !== owner && id !== M.sender.jid);
                if (!members.length)
                    return;
                const batchSize = 10;
                for (let i = 0; i < members.length; i += batchSize) {
                    const batch = members.slice(i, i + batchSize);
                    await this.client.sock.groupParticipantsUpdate(M.from, batch, 'remove').catch(() => { });
                }
                this.purgeSet.delete(M.from);
                return;
            }
            this.purgeSet.add(M.from);
            M.reply('Use the command again to confirm.');
            setTimeout(() => this.purgeSet.delete(M.from), 30 * 1000);
        };
    }
};
command = __decorate([
    Command('purge', {
        description: '',
        category: 'moderation',
        exp: 5,
        cooldown: 5,
        usage: 'purge',
        adminRequired: true
    })
], command);
export default command;
