const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    async run() {
        // fetch appInfo
        this.client.appInfo = await this.client.fetchApplication();

        if (this.client.users.has("1")) this.client.users.delete("1");

        this.client.console.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`);

        // Check twitch streamers
        this.client.checkTwitch();
    }

};
