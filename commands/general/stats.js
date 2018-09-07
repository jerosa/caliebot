const Command = require("../../lib/structures/Command.js");
const { version, MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

class Stats extends Command {

	constructor(...args) {
		super(...args, {
			name: "stats",
			description: "Muestra estadisticas útiles del bot.",
			usage: "stats",
			aliases: []
		});
	}

	async run(message, args, level) { // eslint-disable-line no-unused-vars
		const duration = moment.duration(this.client.uptime).format(" D [días], H [horas], m [mins], s [segs]");
		const embed = new MessageEmbed()
			.setDescription(`\`\`\`asciidoc\n= ESTADÍSTICAS =
• Uso Mem    :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Usuarios   :: ${this.client.users.size.toLocaleString()}
• Servidores :: ${this.client.guilds.size.toLocaleString()}
• Canales    :: ${this.client.channels.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}\`\`\``)
			.setColor(message.guild ? message.guild.me.roles.highest.color : 5198940);
		message.channel.send({ embed });
	}

}

module.exports = Stats;
