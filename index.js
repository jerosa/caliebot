require("dotenv").config();
require("./util/Prototypes.js");
require("./lib/extenders/Message");
require("./lib/extenders/GuildMember.js");
require("./lib/extenders/Guild.js");
require("./lib/extenders/DMChannel.js");
require("./lib/extenders/TextChannel.js");
const Client = require("./lib/CaliebotClient.js");
const errorDirnameRegex = new RegExp(`${__dirname}/`, "g");

const client = new Client({
	disabledEvents: ["CHANNEL_PINS_UPDATE", "GUILD_BAN_ADD", "GUILD_BAN_REMOVE", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE", "TYPING_START", "VOICE_SERVER_UPDATE"],
	disableEveryone: true
});

client.login(process.env.BOT_TOKEN);

client.on("disconnect", () => client.console.warn("Bot is disconnecting..."))
	.on("reconnect", () => client.console.log("Bot reconnecting..."))
	.on("error", err => client.console.error(err))
	.on("warn", info => client.console.warn(info));

process.on("uncaughtException", err => {
	const errorMsg = err.stack.replace(errorDirnameRegex, "./");
	client.console.error(`Uncaught Exception: ${errorMsg}`);
	process.exit(1);
});

process.on("unhandledRejection", client.console.error);
