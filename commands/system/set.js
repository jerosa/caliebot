const Command = require("../../lib/structures/Command.js");

class Set extends Command {

	constructor(...args) {
		super(...args, {
			name: "set",
			description: "Ver o cambiar ajustes del servidor.",
			category: "System",
			usage: "set <view/get/edit> <key> <value>",
			guildOnly: true,
			aliases: ["setting", "settings"],
			permLevel: "Administrator"
		});
	}

	async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars,consistent-return
		const defaults = this.client.config.defaultSettings;

		if (action === "edit") {
			if (!key) return message.reply("Por favor, especifica una clave para editar.");
			if (!message.settings[key].toString()) return message.reply("Esta clave no existe en los ajustes.");
			if (value.length < 1) return message.reply("Por favor, especifica un nuevo valor.");

			const data = { [key]: value.join(" ") };
			await this.client.writeSettings(message.guild.id, data);
			await message.reply(`${key} editada correctamente a ${value.join(" ")}`);
		} else
		// Thirdly, if a user does `-set del <key>`, let's ask the user if they're sure...
		if (action === "del" || action === "reset") {
			if (!key) return message.reply("Por favor, especifica una clave para borrar (reset).");
			if (!message.settings[key]) return message.reply("Esta clave no existe en los ajustes.");

			// Throw the 'are you sure?' text at them.
			const response = await this.client.awaitReply(message, `¿Seguro que quieres cambiar la clave \`${key}\` al valor por defecto \`${defaults[key]}\`?`);

			// If they respond with y or yes, continue.
			if (["y", "yes", "s", "si"].includes(response)) {
				const data = { [key]: defaults[key] };
				await this.client.writeSettings(message.guild.id, data);
				await message.reply(`${key} ha sido reseteada al valor por defecto.`);
			} else

			// If they respond with n or no, we inform them that the action has been cancelled.
			if (["n", "no", "cancel"].includes(response)) {
				message.reply(`Los ajustes para \`${key}\` permanecen en \`${message.settings[key]}\``);
			}
		} else

		// Using `-set get <key>` we simply return the current value for the guild.
		if (action === "get") {
			if (!key) return message.reply("Por favor, especifica una clave para ver.");
			if (!message.settings[key]) return message.reply("Esta clave no existe en los ajustes.");
			message.reply(`El valor de ${key} es actualmente \`${message.settings[key]}\``);
		} else {
			// Otherwise, the default action is to return the whole configuration in JSON format (to be prettified!);
			const array = [];
			Object.entries(message.settings).forEach(([mkey, mvalue]) => {
				if (mkey === "updatedAt" || mkey === "createdAt" || mkey === "id") return;
				array.push(`${mkey}${" ".repeat(20 - mkey.length)}::  ${mvalue}`);
			});
			await message.channel.send(`= Ajustes actuales del servidor =\n${array.join("\n")}`, { code: "asciidoc" });
		}
	}

}

module.exports = Set;
