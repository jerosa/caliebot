const { Client, MessageEmbed } = require("discord.js");
const CommandStore = require("./stores/CommandStore");
const EventStore = require("./stores/EventStore");
const CaliebotConsole = require("./CaliebotConsole");
const Database = require("./structures/Database");

class Caliebot extends Client {

	constructor(options) {
		super(options);

		this.config = require("../config");
		this.console = new CaliebotConsole(this);
		this.commands = new CommandStore(this);
		this.events = new EventStore(this);
		this.levelCache = {};
		this.database = new Database(this);
		this.responses = require("../assets/responses");
		this.methods = {
			errors: require("../util/CustomError"),
			util: require("../util/util"),
			twitch: require("../util/TwitchAPI")
		};

		this.settings = this.database.settings;
		this.points = this.database.points;
		this.twitch = this.database.twitch;

		this.ready = false;
		this.maintenance = false;
		this.on("ready", this._ready.bind(this));
	}

	async login(token) {
		await this.init();
		return super.login(token);
	}

	_ready() {
		this.database._ready();
		this.ready = true;
		this.emit("caliebotReady");
	}

	permlevel(message) {
		let permlvl = 0;

		const permOrder = this.config.permLevels.slice(0).sort((prev, val) => prev.level < val.level ? 1 : -1);

		while (permOrder.length) {
			const currentLevel = permOrder.shift();
			if (message.guild && currentLevel.guildOnly) continue;
			if (currentLevel.check(message)) {
				permlvl = currentLevel.level;
				break;
			}
		}
		return permlvl;
	}

	async getSettings(id) {
		const [config] = await this.settings.findOrCreate({ where: { id } });
		return config.dataValues;
	}

	async writeSettings(id, data) {
		const config = await this.settings.findById(id);
		const result = await config.update(data);
		return result.dataValues;
	}

	async getTwitch(user) {
		const [streamer] = await this.twitch.findOrCreate({
			where: { id: user.id },
			defaults: {
				id: user.id,
				name: user.login,
				url: `https://www.twitch.tv/${user.login}`,
				profileImage: user.profile_image_url
			}
		});
		return streamer.dataValues;
	}

	async setTwitch(id, data) {
		const streamer = await this.twitch.findById(id);
		await streamer.update(data);
	}

	async findTwitch(id) {
		const streamer = await this.twitch.findById(id);
		return streamer;
	}

	async getAllTwitch() {
		const streamers = await this.twitch.findAll();
		const col = [];
		for (const element of streamers) {
			col.push(element.dataValues);
		}
		return col;
	}

	async checkTwitch() {
		setTimeout(async () => {
			const streamers = await this.getAllTwitch();
			streamers.forEach(async streamer => {
				const stream = await this.methods.twitch.getStreamData(streamer.id);
				if (stream === undefined && streamer.live) {
					streamer.live = false;
					await this.setTwitch(streamer.id, streamer);
					this.console.log(`Se ha acabado el streaming de ${streamer.name}`);
				} else if (stream && stream.type === "live" && !streamer.live) {
					streamer.live = true;
					await this.setTwitch(streamer.id, streamer);
					this.console.log(`Empieza el streaming de ${streamer.name}`);

					const embed = new MessageEmbed()
						.setTitle(`${streamer.name} ha empezado un streaming!`)
						.setDescription(`\`\`\`asciidoc\n= INFO =
• Título :: ${stream.title}
• Juego  :: ${stream.game_id}\`\`\``)
					// • Espectadores  :: ${stream.viewer_count}\`\`\``)
						.setColor(5198940)
						.setURL(streamer.url)
						.setThumbnail(`${streamer.profileImage}`)
						.setImage(`${stream.thumbnail_url}`.replace("{width}", 400).replace("{height}", 300));

					streamer.guilds.forEach(async guildID => {
						const guild = this.guilds.get(guildID);
						const settings = await this.getSettings(guildID);
						const channel = guild.channels.find("name", settings.twitchChannel);
						if (!channel) {
							this.console.error(`Not found twitch channel on ${guild.id}`);
						} else {
							await channel.send({ embed });
							await channel.send(`@everyone Empieza el directo de ${streamer.name}`, { disableEveryone: false });
						}
					});
				}
			});
			this.checkTwitch();
		}, process.env.TWITCH_INTERVAL * 1000);
	}


	async init() {
		const [commands, events] = await Promise.all([this.commands.loadFiles(), this.events.loadFiles()]);
		this.console.log(`Loaded a total of ${commands} commands`);
		this.console.log(`Loaded a total of ${events} events`);

		this.config.permLevels.forEach(permLevel => {
			this.levelCache[permLevel.name] = permLevel.level;
		});
	}

}

module.exports = Caliebot;
