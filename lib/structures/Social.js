const Command = require("./Command.js");

class Social extends Command {

	constructor(client, file, options = {}) {
		super(client, file, Object.assign(options, { guildOnly: true }));
		this.loadingString = options.loadingString;
	}

	async verifySocialUser(message, user, options = {}) {
		const check = await this.verifyUser(message, user, options);
		if (!check) return;
		return [!!check.bot, check]; // eslint-disable-line
	}

	cmdVerify() {
		return Promise.resolve();
	}

}

module.exports = Social;
