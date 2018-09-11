const Social = require("../../lib/structures/Social.js");

class HardMute extends Social {

	constructor(...args) {
		super(...args, {
			name: "hardMute",
			description: "Silencia a un usuario tanto de hablar por voz como por chat.",
			category: "admin",
			extended: "Asinga a un usuario un rol 'silenciado' y lo mueve a un canal de voz sin permisos para hablar en caso de estar en un chat de voz",
			usage: "hardMute <user>",
			aliases: ["gulag"],
			permLevel: "Administrator",
			botPerms: ["MANAGE_ROLES", "MOVE_MEMBERS"],
			loadingString: "... **{{displayName}}** se está enfadando..."
		});
	}

	cmdVerify(message, args, loadingMessage) {
		let target = message.mentions.members;
		if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("Necesitas mencionar a alguien para castigarlo.", loadingMessage));
		target = target.first();
		if (target.user.bot) return Promise.reject(new this.client.methods.errors.UsageError("Los bots no pueden ser castigados.", loadingMessage));
		if (message.member === target) return Promise.reject(new this.client.methods.errors.UsageError("No puedes castigarte a ti mismo!", loadingMessage));
		return Promise.resolve(target);
	}

	async run(message, args, level, loadingMessage) {
		const target = await this.cmdVerify(message, args, loadingMessage);
		const mutedRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.mutedRole.toLowerCase());
		if (!mutedRole) return loadingMessage.edit("No se ha encontrado el rol 'muted'.");
		const mutedChannel = message.guild.channels.find(r => r.name.toLowerCase() === message.settings.mutedChannel.toLowerCase());
		if (!mutedChannel) return loadingMessage.edit("No se ha encontrado el canal 'muted'.");

		try {
			await target.roles.add(mutedRole);
			if (target.voiceChannel) await target.setVoiceChannel(mutedChannel);
			// min and max seconds
			const max = 2 * 60 * 1000;
			const min = 1 * 60 * 1000;
			setTimeout(() => target.roles.remove(mutedRole), this.client.methods.util.randomInt(max, min));
			return await loadingMessage.edit({
				embed: {
					title: `${mutedChannel.name} te reclama ${target.displayName}`,
					description: `${this.client.responses.muteMessages.random().replaceAll("{{user}}", target.displayName)}`,
					color: message.guild ? message.guild.me.roles.highest.color : 5198940,
					image: { url: `${this.client.responses.muteImages.random()}` }
				}
			});
		} catch (error) {
			if (error.message === "Unknown Message") throw error;
			const msg = await message.channel.send(error.message);
			return await msg.delete(10000);
		}
	}

}

module.exports = HardMute;
