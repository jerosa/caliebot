const fetch = require("node-fetch");
const { TWITCH_TOKEN } = process.env;

class TwitchAPI {

	constructor() {
		throw new Error("This class may not be instantiated.");
	}

	static async getUserData(name) {
		const data = await fetch(`https://api.twitch.tv/helix/users?login=${name}`, {
			method: "GET",
			headers: { "Client-ID": TWITCH_TOKEN }
		})
			.then(res => res.json())
			.then(json => json.data[0]);
		return data;
	}

	static async getStreamData(id) {
		const data = await fetch(`https://api.twitch.tv/helix/streams?user_id=${id}`, {
			method: "GET",
			headers: { "Client-ID": TWITCH_TOKEN }
		})
			.then(res => res.json())
			.then(json => json.data[0]);
		return data;
	}

	static async getGameData(id) {
		const data = await fetch(`https://api.twitch.tv/helix/games?id=${id}`, {
			method: "GET",
			headers: { "Client-ID": TWITCH_TOKEN }
		})
			.then(res => res.json())
			.then(json => json.data[0]);
		return data;
	}

}

module.exports = TwitchAPI;
