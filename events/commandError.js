const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    async run(error, message) {
        if (error instanceof this.client.methods.errors.CustomError) {
            if (error.msg) return error.msg.edit(error.message);
            return message.channel.send(error.message);
        }
        message.channel.send("Algo ha ido mal, por favor inténtalo más tarde.");
        return this.client.console.error(error);
    }

};
