const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    leaveMessage(member, settings) {
        if (!settings.welcomeEnabled) return;
        const channel = member.guild.channels.find("name", settings.welcomeChannel);
        if (!channel || !channel.postable) return;

        if (settings.welcomeType === "text") {
            const message = this.client.responses.goodbyeMessages.random()
                .replaceAll("{{user}}", member.user.username)
                .replaceAll("{{amount}}", member.guild.memberCount)
                .replaceAll("{{guild}}", member.guild.name).trim();
            channel.send(`${message}`).catch(this.console.error);
        }
    }

    async run(member) {
        if (!member || !member.id || !member.guild) return;
        // Logging
        this.client.emit("customLog", member.guild, "leave", { name: "leave" }, member.user);
        const settings = await this.client.getSettings(member.guild.id);
        this.leaveMessage(member, settings);
    }

};
