const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    async run(guild, user) {
        this.client.emit("customLog", guild, "unban", { name: "unban" }, user);
    }

};
