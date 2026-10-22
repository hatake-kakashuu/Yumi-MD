var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, Command } from '../../Structures/index.js';
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async ({ reply }) => {
            const buffer = await this.client.utils.getBuffer('https://weeb-api.vercel.app/loli');
            return void (await reply(buffer, 'image'));
        };
    }
};
default_1 = __decorate([
    Command('loli', {
        description: 'Sends a random nsfw cosplay image',
        category: 'weeb',
        usage: 'loli',
        exp: 20,
        cooldown: 5
    })
], default_1);
export default default_1;
