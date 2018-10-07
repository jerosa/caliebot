const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    async run(guild, user) {
        this.client.emit("customLog", guild, "ban", { name: "ban" }, user);
    }

};
