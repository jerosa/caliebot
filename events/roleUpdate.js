const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    async run(role) {
        this.client.emit("customLog", role.guild, "roleUpdate", { role: role, name: "roles" });
    }

};
