const { Collection, MessageEmbed } = require("discord.js");
const Command = require("../../lib/structures/Command.js");
const perpage = 10;

class Help extends Command {

    constructor(...args) {
        super(...args, {
            name: "help",
            description: "Proporciona ayuda con un comando, categoría o ajuste",
            extended: "Este comando muestra todos los comandos disponibles para tu nivel. Para más informacion acerca de un comnado escribe 'help <nombre del comando>'.",
            category: "System",
            usage: "help <categoría/comando/ajustes> [num-pag]",
            aliases: ["h", "halp"],
            botPerms: ["EMBED_LINKS"]
        });
    }

	async run(message, [type, page], level) { // eslint-disable-line
        if (type) type = type.toLowerCase();
        if (page) page = parseInt(page);

        const embed = new MessageEmbed()
            .setTimestamp()
            .setColor(6192321)
            .setFooter(`Pedido por ${message.author.tag}`, message.author.avatarURL());

        let currentCategory = "";
        const sorted = this.client.commands.sort((p, c) => p.category > c.category ? 1 : p.name > c.name && p.category === c.category ? 1 : -1);

        if (!type) {
            const description = `Lista de categorías\n\nEscribe \`${message.settings.prefix}help <categoría>\` para encontrar comandos de una categoría específica.`;
            // NOTE: unable to make filtering using .filter()
            let output = new Collection();
            for (const [key, value] of sorted.entries()) {
                if (!(level < 10 && value.category === "Owner") || !(value.category === "NSFW" && !message.channel.nsfw)) {
                    output.set(key, value);
                }
            }
            output = output.map(c => {
                const cat = c.category.toProperCase();
                if (currentCategory !== cat && !type) {
                    currentCategory = cat;
                    return `\n\`${message.settings.prefix}help ${cat.toLowerCase()}\` | Muestra comandos de la categoría ${cat}`;
                }
                return null;
            }).join("");

            embed.setDescription(description)
                .addField("Categorías", output);
        } else if (this.client.commands.has(type)) {
            const cm = this.client.commands.get(type) || this.client.commands.get(this.client.aliases.get(type));
            if (level < this.client.levelCache[cm.permLevel]) return;
            embed.setTitle(cm.name.toProperCase())
                .addField("Descripción del comando", cm.description)
                .addField("Uso del comando", `\`${cm.usage}\``)
                .addField("Alias", cm.aliases.length === 0 ? "None" : cm.aliases.join(", "))
                .addField("Descripción extendida", cm.extended);
        } else {
            let n = 0;
            sorted.forEach(c => {
				c.category.toLowerCase() === type ? n++ : n; // eslint-disable-line
            });

            let output = "";
            let num = 0;
            const pg = page && page <= Math.ceil(n / perpage) ? page : 1;
            for (const c of sorted.values()) {
                if (c.category.toLowerCase() === type) {
                    if (num < perpage * pg && num > (perpage * pg) - (perpage + 1)) {
						if (level < this.client.levelCache[c.permLevel]) continue; // eslint-disable-line
						if (c.category === "NSFW" && !message.channel.nsfw && level < 10) continue; // eslint-disable-line
                        output += `\n\`${message.settings.prefix + c.name}\` | ${c.description.length > 50 ? `${c.description.slice(0, 50)}...` : c.description}`;
                    }
                    num++;
                }
            }

            if (!num) return;
            embed.setTitle("Ayuda categorías")
                .setDescription(`Una lista con los comandos en la categoría${type}.\n(Un total de ${num} comandos en esta categoría)\n\n
Para obtener más ayuda acerca de un comando escribe \`${message.settings.prefix}help <comando>\`\n\n
${num > 10 && pg === 1 ? `Para ver más comandos escribe\` ${message.settings.prefix}help <categoría> 2\`` : ""}`)
                .addField("Comandos", output);
        }
        message.channel.send(embed);
    }

}

module.exports = Help;
