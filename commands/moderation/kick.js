const Moderation = require("../../lib/structures/Moderation.js");

class Kick extends Moderation {

    constructor(...args) {
        super(...args, {
            name: "kick",
            description: "Expulsa a un usuario del servidor.",
            category: "moderation",
            usage: "kick <@usuario> <razón>"
        });
    }

    async run(message, [mention, ...args], level) { // eslint-disable-line no-unused-vars
        const target = await this.cmdVerify(message, level);
        if (!target.kickable) {
            message.reply("No puedo kickear a este usuario");
            return;
        }
        const reason = args && args.length > 0 ? args.join(" ") : "No se ha indicado un motivo";
        await target.kick(reason);
        this.client.emit("customLog", message.guild, "kick", { name: "kick", reason: reason, kicker: message.author }, target.user);
        await message.channel.send(`Se ha kickeado con éxito a ${target.user.username}.`);
    }

}

module.exports = Kick;
