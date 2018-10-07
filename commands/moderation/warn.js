const Moderation = require("../../lib/structures/Moderation.js");

class Warn extends Moderation {

    constructor(...args) {
        super(...args, {
            name: "warn",
            description: "Lanza un aviso a un usuario",
            category: "moderation",
            usage: "warn <usuario> <razón>"
        });
    }

    async run(message, [mention, ...args], level) { // eslint-disable-line no-unused-vars
        const target = await this.cmdVerify(message, level);
        const reason = args && args.length > 0 ? args.join(" ") : `No se ha indicado un motivo.`;
        this.client.emit("customLog", message.guild, "warn", { name: "warn", reason: reason, warner: message.author }, target.user);

        await target.send(`Has recibido un aviso en el servidor \`${message.guild.name}\` por ${message.author.tag}. Razón: ${reason}`).catch(() => null);
        await message.channel.send(`Se ha advertido con éxito a ${target.user.username}.`);
    }

}

module.exports = Warn;
