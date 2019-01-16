const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    async run(role) {
        this.client.emit("customLog", role.guild, "roleDelete", { role: role, name: "roles" });
    }

};
