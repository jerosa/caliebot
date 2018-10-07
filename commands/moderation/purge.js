const Moderation = require("../../lib/structures/Moderation.js");

class Purge extends Moderation {

    constructor(...args) {
        super(...args, {
            name: "purge",
            description: "Permite borrar mensajes de un canal o usuario.",
            category: "moderation",
            usage: "purge [numMensajes] [link|links|invite|invites|bots|caliebot|me|upload|uploads|@usuario]",
            aliases: ["clean", "remove", "delete"],
            botPerms: ["MANAGE_MESSAGES"]
        });
    }

    getFilter(message, filter, user) {
        switch (filter) {
            case "link" || "links": return msg => /https?:\/\/[^ /.]+\.[^ /.]+/.test(msg.content);
            case "invite" || "invites": return msg => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(msg.content);
            case "bots": return msg => msg.author.bot;
            case "caliebot": return msg => msg.author.id === this.client.user.id;
            case "me": return msg => msg.author.id === message.author.id;
            case "upload" || "uploads": return msg => msg.attachments.size > 0;
            case "user": return msg => msg.author.id === user.id;
            default: return () => true;
        }
    }

    async run(message, [limit = 10, filter = null], level) { // eslint-disable-line no-unused-vars
        await message.delete();
        let messages = await message.channel.messages.fetch({ limit: 100 });

        if (filter) {
            let user = message.mentions.members;
            if (user.size > 0) {
                user = user.first();
                filter = "user";
            } else {
                user = null;
            }
            const type = filter;
            messages = messages.filter(this.getFilter(message, type, user));
        }
        messages = messages.array().slice(0, limit);
        await message.channel.bulkDelete(messages, true).catch(() => message.reply("Lo he intentado, pero algunos mensajes tenían más de 14 días así que no he podido eliminarlos."));
        const msg = await message.channel.send(`***Se han borrado ${messages.length} mensajes***`);
        msg.delete({ timeout: 5000 });
    }

}

module.exports = Purge;
