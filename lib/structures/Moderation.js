const Command = require("./Command.js");

class Moderation extends Command {

    constructor(client, file, options = {}) {
        super(client, file, Object.assign(options, { guildOnly: true, permLevel: "Moderator" }));
    }

    cmdVerify(message, level) {
        let target = message.mentions.members;
        if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("Necesitas mencionar a alguien para castigarlo."));
        target = target.first();
        if (target.user.bot) return Promise.reject(new this.client.methods.errors.UsageError("Los bots no pueden ser castigados."));
        if (message.member === target) return Promise.reject(new this.client.methods.errors.UsageError("No puedes castigarte a ti mismo!"));
        if (this.client.permlevel(message, target) >= level) return Promise.reject(new this.client.methods.errors.UsageError("No puedes castigar a alguien de mayor o igual rango!"));
        return Promise.resolve(target);
    }

}

module.exports = Moderation;
