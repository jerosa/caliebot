const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

	async run(guild) {
		this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Server${this.client.guilds.size > 1 ? "s" : ""}`);

		this.client.console.log(`A guild has been left: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
	}

};
