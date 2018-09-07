const Command = require("../../lib/structures/Command.js");

class Reboot extends Command {

	constructor(...args) {
		super(...args, {
			name: "reboot",
			description: "Reinicia el bot.",
			category: "System",
			usage: "reboot",
			permLevel: "Bot Admin"
		});
	}

	async run(message) {
		await message.channel.send(`${this.client.responses.rebootMessages.random().replaceAll("{{user}}", message.member.displayName)}`).catch(err => this.client.console.error(err));
		process.exit(1);
	}

}

module.exports = Reboot;
