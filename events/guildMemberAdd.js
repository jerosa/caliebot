const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

	async run(member) {
		if (!member || !member.id || !member.guild) return;
		const settings = this.client.getSettings(member.guild.id);
		const channel = member.guild.channels.find("name", settings.welcomeChannel);

		if (!channel) return;
		if (!settings.welcomeEnabled) return;
		if (settings.welcomeType === "text") {
			const message = this.client.responses.welcomeMessages.random()
				.replaceAll("{{user}}", member.user.username)
				.replaceAll("{{amount}}", member.guild.memberCount)
				.replaceAll("{{guild}}", member.guild.name).trim();
			channel.send(`${this.client.emojis.get("306041018099433472")} ${message}`).catch(this.console.error);
		}
	}

};
