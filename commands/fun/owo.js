const Social = require("../../lib/structures/Social");
const fetch = require("node-fetch");

class Owo extends Social {

	constructor(...args) {
		super(...args, {
			name: "owo",
			description: "OwO, what's this?",
			usage: "owo",
			category: "Fun",
			cost: 5,
			aliases: ["uwu", "UwU", "OwO"],
			loadingString: "... OwO whats this? **{{displayName}}**..."
		});
	}

	async run(message, args, level, loadingMessage) {
		const body = await fetch("https://rra.ram.moe/i/r?type=owo", { method: "GET" })
			.then(res => res.json());
		await loadingMessage.edit({
			embed: {
				title: "Click here if the image failed to load.",
				url: `https://cdn.ram.moe/${body.path.replace("/i/", "")}`,
				color: message.guild ? message.guild.me.roles.highest.color : 5198940,
				image: { url: `https://cdn.ram.moe/${body.path.replace("/i/", "")}` }
			}
		});
	}

}

module.exports = Owo;
