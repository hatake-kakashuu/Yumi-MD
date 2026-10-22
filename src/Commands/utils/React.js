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
        this.execute = async ({ react, quoted, emojis, message }) => {
            const key = quoted ? quoted.key : message.key;
            return void (await react(emojis[0] || '👍', key ?? undefined));
        };
    }
};
default_1 = __decorate([
    Command('react', {
        category: 'utils',
        description: 'Reacts a message with the given emoji',
        usage: 'react [emoji] || react [emoji] [quote a message]',
        cooldown: 5,
        exp: 10
    })
], default_1);
export default default_1;
