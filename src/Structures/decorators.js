export const commands = new Map();
export const aliases = new Map();
export function Command(name, options) {
    return function (target) {
        const data = {
            name,
            description: options.description,
            category: options.category || 'Other',
            aliases: options.aliases || [],
            usage: options.usage,
            class: target
        };
        commands.set(name, data);
        for (const alias of data.aliases) {
            aliases.set(alias, name);
        }
    };
}
