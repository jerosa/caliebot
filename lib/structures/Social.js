const Command = require("./Command.js");
const fetch = require("node-fetch");

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

    async cmdMoe(type, nsfw = false) {
        const body = await fetch(`https://rra.ram.moe/i/r?type=${type}&nsfw=${nsfw}`)
            .then(res => res.json());
        return body.path.replace("/i/", "");
    }

}

module.exports = Social;
