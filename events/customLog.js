const Event = require("../lib/structures/Event.js");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Event {

    async run(guild, type, data, user) {
        const settings = await this.client.getSettings(guild.id);
        if (!settings.logging) return;
        const channel = guild.channels.find("name", settings.loggingChannel);
        if (!channel || !channel.postable) return;
        switch (type) {
            case "join":
                channel.send(this.generateEmbed(`📥 ${user} has joined **${guild.name}**.`, "#5cb85c",
                    { footer: "Member Joined", title: `${user.tag} | ${user.id}`, avatar: user.displayAvatarURL() }));
                break;
            case "leave":
                channel.send(this.generateEmbed(`📤 ${user} has left **${guild.name}**.`, "#d9534f",
                    { footer: "Member Left", title: `${user.tag} | ${user.id}`, avatar: user.displayAvatarURL() }));
                break;
            case "warn":
                channel.send(this.generateEmbed(`:warning: ${user} has been **warned** by ${data.warner} for \`${data.reason}\`.`, "#d9534f",
                    { footer: "Member Warned", title: `${user.tag} | ${user.id}`, avatar: user.displayAvatarURL() }));
                break;
            case "kick":
                channel.send(this.generateEmbed(`👢 ${user} has been **kicked** by ${data.kicker} for \`${data.reason}\`.`, "#d9534f",
                    { footer: "Member Kicked", title: `${user.tag} | ${user.id}`, avatar: user.displayAvatarURL() }));
                break;
            case "ban":
                channel.send(this.generateEmbed(`🔨 ${user} has been **banned**.`, "#d9534f",
                    { footer: "Member Banned", title: `${user.tag} | ${user.id}`, avatar: user.displayAvatarURL() }));
                break;
            case "mute":
                channel.send(this.generateEmbed(`🔇 ${user} has been **muted** by ${data.muter}.`, "#d9534f",
                    { footer: "Member Muted", title: `${user.tag} | ${user.id}`, avatar: user.displayAvatarURL() }));
                break;
            case "unmute":
                channel.send(this.generateEmbed(`🔈 ${user} has been **un-muted** by ${data.muter}.`, "#5cb85c",
                    { footer: "Member Unmuted", title: `${user.tag} | ${user.id}`, avatar: user.displayAvatarURL() }));
                break;
            case "unban":
                channel.send(this.generateEmbed(`🔨 ${user} has been **un-banned**.`, "#428bca",
                    { footer: "Member Unbanned", title: `${user.tag} | ${user.id}`, avatar: user.displayAvatarURL() }));
                break;
            case "msgBulkDelete":
                channel.send(this.generateEmbed(`❌ \`${data.count}\` Messages Deleted in ${data.channel}`, "#d9534f", { footer: `Bulk Messages Deleted` }));
                break;
            case "roleCreate":
                channel.send(this.generateEmbed(`☑ **${data.role}** (${data.role.id}) role was \`created\``, "#5cb85c", { footer: `Role Created` }));
                break;
            case "roleDelete":
                channel.send(this.generateEmbed(`❌ **${data.role}** (${data.role.id}) role was \`deleted\``, "#d9534f", { footer: `Role Deleted` }));
                break;
            case "roleUpdate":
                channel.send(this.generateEmbed(`🔄 **${data.role}** (${data.role.id}) role was \`updated\``, "#428bca", { footer: `Role Updated` }));
                break;
            default: break;
        }
    }

    generateEmbed(message, color, data) {
        const embed = new MessageEmbed()
            .setColor(color)
            .setTimestamp()
            .setDescription(message);
        if (data.title) embed.setAuthor(data.title, data.avatar);
        if (data.image) embed.setImage(data.image);
        if (data.footer) embed.setFooter(data.footer);
        return embed;
    }

};
