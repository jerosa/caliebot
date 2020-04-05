const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    welcomeMessage(member, settings) {
        if (!settings.welcomeEnabled) return;
        const channel = member.guild.channels.cache.find(c => c.name === settings.welcomeChannel);
        if (!channel || !channel.postable) return;

        if (settings.welcomeType === "text") {
            let rulesChannel = member.guild.channels.cache.find(c => c.name === settings.rulesChannel);
            if (!rulesChannel) rulesChannel = "No hay canal de reglas!";
            const message = this.client.responses.welcomeMessages.random()
                .replaceAll("{{user}}", member.user.username)
                .replaceAll("{{rules}}", rulesChannel);
            channel.send(`${message}`).catch(console.error);
        }
    }

    async run(member) {
        if (!member || !member.id || !member.guild) return;
        // Logging
        this.client.emit("customLog", member.guild, "join", { name: "join" }, member.user);
        const settings = await this.client.getSettings(member.guild.id);
        this.welcomeMessage(member, settings);
    }

};
