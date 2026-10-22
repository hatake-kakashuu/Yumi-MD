var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Characters } from '@shineiichijo/marika';
import { Command, BaseCommand } from '../../Structures/index.js';
class Character {
    constructor() {
        this.client = new Characters();
    }
    searchCharacter(query) {
        return this.client.getCharactersSearch({ q: query });
    }
    getCharacterAnime(id) {
        return this.client.getCharacterAnime(id).then(anime => ({ data: anime }));
    }
    getCharacterManga(id) {
        return this.client.getCharacterManga(id).then(manga => ({ data: manga }));
    }
}
let default_1 = class extends BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            if (!context)
                return void M.reply('Provide a query for the search, Baka!');
            const query = context.trim();
            await new Character()
                .searchCharacter(query)
                .then(async ({ data }) => {
                const chara = data[0];
                let source;
                await new Character()
                    .getCharacterAnime(chara.mal_id)
                    .then((res) => (source = res.data[0].anime.title))
                    .catch(async () => {
                    await new Character()
                        .getCharacterManga(chara.mal_id.toString())
                        .then((res) => (source = res.data[0].manga.title))
                        .catch(() => (source = ''));
                });
                let text = `💙 *Name:* ${chara.name}\n💚 *Nicknames:* ${chara.nicknames.join(', ')}\n💛 *Source:* ${source}`;
                if (chara.about !== null)
                    text += `\n\n❤ *Description:* ${chara.about}`;
                const image = await this.client.utils.getBuffer(chara.images.jpg.image_url);
                return void (await M.reply(image, 'image', undefined, undefined, text, undefined, {
                    title: chara.name,
                    mediaType: 1,
                    thumbnail: image,
                    sourceUrl: chara.url
                }));
            })
                .catch(() => {
                return void M.reply(`No character found | *"${query}"*`);
            });
        };
    }
};
default_1 = __decorate([
    Command('character', {
        description: 'Searches a character of the given query in MyAnimeList',
        usage: 'character [query]',
        category: 'utils',
        aliases: ['chara'],
        exp: 20,
        cooldown: 20
    })
], default_1);
export default default_1;
