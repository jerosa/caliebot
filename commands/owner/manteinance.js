const Owner = require("../../lib/structures/Owner.js");

class Maintenance extends Owner {

    constructor(...args) {
        super(...args, {
            name: "maintenance",
            description: "Turn on/off the maintenance mode.",
            category: "Owner",
            usage: "maintenance",
            permLevel: "Bot Owner"
        });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        if (this.client.maintenance) {
            message.channel.send("Turned maintenance mode off");
            this.client.maintenance = false;
        } else {
            message.channel.send("Turned maintenance mode on");
            this.client.maintenance = true;
        }
    }

}

module.exports = Maintenance;
