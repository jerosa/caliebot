const Command = require("../../lib/structures/Command.js");

class Twitch extends Command {

	constructor(...args) {
		super(...args, {
			name: "twitch",
			description: "Añade o quita avisos de directos de twitch.",
			extended: "Este comando permite añadir y quitar avisos de directos de Twitch en un canal de texto predeterminado.",
			category: "System",
			usage: "twitch <add/del/wipe> <streamer>",
			cooldown: 10,
			guildOnly: true,
			permLevel: "Administrator"
		});
	}

	async run(message, [action, key], level) { // eslint-disable-line no-unused-vars
		if (action === "add") {
			const user = await this.getStreamer(message, key);
			if (user === undefined) return;
			const streamer = await this.client.getTwitch(user, message.guild.id);
			if (streamer.guilds.indexOf(message.guild.id) > -1) {
				message.response(undefined, `El streamer **${user.login}** ya está registrado en el servidor!`);
			} else {
				streamer.guilds.push(message.guild.id);
				await this.client.setTwitch(user.id, streamer);
				message.channel.send(`El streamer **${user.login}** se ha registrado en el servidor!`);
			}
		} else if (action === "del") {
			const user = await this.getStreamer(message, key);
			if (user === undefined) return;
			const streamer = await this.client.findTwitch(user.id);
			if (streamer === null) {
				message.response(undefined, `El streamer **${user.login}** no está registrado.`);
				return;
			}
			const index = streamer.dataValues.guilds.indexOf(message.guild.id);
			if (index < 0) {
				message.response(undefined, `El streamer **${user.login}** no está registrado en el servidor.`);
				return;
			}
			streamer.dataValues.guilds.splice(index, 1);
			// check if empty
			if (streamer.dataValues.guilds.length < 1) {
				this.client.console.log(`Removing streamer ${user.login} from DB`);
				await streamer.destroy();
				return;
			}
			this.client.console.log(`Removing streamer ${user.login} from guild ${message.guild.id}`);
			await this.client.setTwitch(user.id, streamer);
			message.channel.send(`El streamer **${user.login}** se ha borrado del servidor!`);
		} else if (action === "wipe") {
			const user = await this.getStreamer(message, key);
			if (!user) return;
			const streamer = await this.client.findTwitch(user.id);
			if (streamer === null) {
				message.response(undefined, `El streamer **${user.login}** no está registrado.`);
				return;
			}
			const index = streamer.dataValues.guilds.indexOf(message.guild.id);
			if (index < 0) {
				message.response(undefined, `El streamer **${user.login}** no está registrado en el servidor.`);
				return;
			}
			if (!streamer.dataValues.live) {
				message.response(undefined, `El streamer **${user.login}** ya está offline.`);
				return;
			}
			await streamer.update({ live: false });
			message.channel.send(`Se ha cambiado el estado de **${user.login}** a offline.`);
		}
	}

	async getStreamer(message, name) {
		let user;
		if (!name) {
			message.response(undefined, "No has escrito el nombre del streamer.");
			return null;
		}
		// check valid twitch login name
		if (/^[a-zA-Z0-9_]{4,25}$/.test(name)) {
			user = await this.client.methods.twitch.getUserData(name);
			if (!user) message.response(undefined, `No se ha encontrado al streamer **${name}**.`);
		} else {
			message.response(undefined, "Nombre de usuario de Twitch inválido. Asegurate de escribir lo que aparece al final de la URL.");
		}
		return user;
	}

}

module.exports = Twitch;
