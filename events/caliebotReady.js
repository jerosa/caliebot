const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    async run() {
        // fetch appInfo
        this.client.appInfo = await this.client.fetchApplication();
        if (this.client.users.cache.has("1")) this.client.users.cache.delete("1");

        this.client.console.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`);

        // Check twitch streamers
        this.client.checkTwitch();
        this.client.checkSubscriber();
    }

};
