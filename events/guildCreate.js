const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    async run(guild) {
        this.client.user.setActivity(`@${this.client.user.username} help | Liebre gorda`);
        this.client.console.log(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
    }

};
