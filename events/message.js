const Event = require("../lib/structures/Event.js");
// const monitor = require("../monitors/monitor.js");
const Social = require("../lib/structures/Social.js");
const { Permissions, Collection } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = class extends Event {

	constructor(...args) {
		super(...args);

		this.impliedPermissions = new Permissions([
			"VIEW_CHANNEL",
			"SEND_MESSAGES",
			"SEND_TTS_MESSAGES",
			"EMBED_LINKS",
			"ATTACH_FILES",
			"READ_MESSAGE_HISTORY",
			"MENTION_EVERYONE",
			"USE_EXTERNAL_EMOJIS",
			"ADD_REACTIONS"
		]);
		this.friendlyPerms = Object.keys(Permissions.FLAGS).reduce((obj, key) => {
			obj[key] = key.split("_").join(" ").toProperCase();
			return obj;
		}, {});

		this.ratelimits = new Collection();
	}

	async run(message) {
		if (message.author.bot) return;
		if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
		if (message.guild && !message.channel.postable) return;

		message.settings = message.guild ? await this.client.getSettings(message.guild.id) : this.client.config.defaultSettings;

		if (message.content === this.client.user.toString() || (message.guild && message.content === message.guild.me.toString())) {
			message.channel.send(`El prefijo es \`${message.settings.prefix}\`.`);
			return;
		}

		const level = this.client.permlevel(message);
		const userPermLevel = this.client.config.permLevels.find(perm => perm.level === level);
		message.author.permLevel = level;

		// if (message.settings.socialSystem && message.settings.chatEarningEnabled) monitor.run(this.client, message, level);

		const prefix = new RegExp(`^<@!?${this.client.user.id}> |^${this.client.methods.util.regExpEsc(message.settings.prefix)}`).exec(message.content);
		if (!prefix) return;
		const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
		const cmd = this.client.commands.get(args.shift().toLowerCase());
		if (!cmd) return;

		const rateLimit = this.ratelimit(message, cmd);

		if (typeof rateLimit === "string") {
			this.client.console.log(`\u001b[43;30m[${userPermLevel.name}]\u001b[49;39m \u001b[44m${message.author.username}
		 (${message.author.id})\u001b[49m got ratelimited while running command ${cmd.name}`);
			message.channel.send(`Por favor, espera ${rateLimit.toPlural()} antes de ejecutar otro comando.`);
			return;
		}

		if (cmd.guildOnly && !message.guild) {
			message.channel.send("Este comando no está disponible via DM. Por favor, ejecuta el comando en un servidor.");
			return;
		}

		if (level < this.client.levelCache[cmd.permLevel]) {
			if (message.settings.systemNotice) {
				const msg = `Eres un nivel ${level}, un ${userPermLevel.name.toLowerCase()}, por qué debería escucharte en vez de a un ${cmd.permLevel} (nivel ${this.client.levelCache[cmd.permLevel]}).`;
				message.channel.send(msg);
			}
			return;
		}

		while (args[0] && args[0][0] === "-") message.flags.push(args.shift().slice(1));
		await this.runCommand(message, cmd, args);
	}

	botPerms(message, cmd) {
		const missing = message.channel.type === "text" ? message.channel.permissionsFor(this.client.user).missing(cmd.botPerms) : this.impliedPermissions.missing(cmd.botPerms);
		if (missing.length > 0) {
			message.channel.send(`El bot no tiene los siguientes permisos: \`${missing.map(key => this.friendlyPerms[key]).join(", ")}\``);
			return false;
		}
		return true;
	}

	async runCommand(message, cmd, args) {
		try {
			const hasPerm = this.botPerms(message, cmd);
			if (!hasPerm) return;
			let msg;
			if (cmd instanceof Social) {
				if (cmd.loadingString) {
					msg = await message.channel.send(cmd.loadingString.replaceAll("{{displayName}}", message.member.displayName).replaceAll("{{me}}", message.guild.me.displayName).replaceAll("{{filterName}}", message.flags[0])); // eslint-disable-line
				}
				await cmd.cmdVerify(message, args, msg);
				if (message.settings.socialSystem && cmd.cost > 0) await cmd.cmdPay(message, message.author.id, cmd.cost, { msg });
			}
			const userPermLevel = this.client.config.permLevels.find(perm => perm.level === message.author.permLevel);
			this.client.console.log(`\u001b[43;30m[${userPermLevel.name}]\u001b[49;39m \u001b[44m${message.author.username} (${message.author.id})\u001b[49m ran command ${cmd.name}`);
			await cmd.run(message, args, message.author.permLevel, msg);
		} catch (error) {
			this.client.emit("commandError", error, message);
		}
	}

	ratelimit(message, cmd) {
		if (message.author.permLevel > 4) return false;

		const cooldown = cmd.cooldown * 1000;
		const ratelimits = this.ratelimits.get(message.author.id) || {};
		if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cooldown;
		const difference = Date.now() - ratelimits[cmd.name];
		if (difference < cooldown) {
			return moment.duration(cooldown - difference).format("D [days], H [hours], m [minutes], s [seconds]", 1);
		} else {
			ratelimits[cmd.name] = Date.now();
			this.ratelimits.set(message.author.id, ratelimits);
			return true;
		}
	}

};
