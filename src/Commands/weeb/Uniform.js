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
            const { images } = await this.client.utils.fetch('https://api.waifu.im/search/?included_tags=uniform');
            return void (await reply(await this.client.utils.getBuffer(images[0].url), 'image'));
        };
    }
};
default_1 = __decorate([
    Command('uniform', {
        description: 'Sends a random uniform image',
        category: 'weeb',
        usage: 'uniform',
        exp: 20,
        cooldown: 5
    })
], default_1);
export default default_1;
