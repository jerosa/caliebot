const Social = require("./Social.js");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const { IMGFLIP_USER, IMGFLIP_PASS } = process.env;

class Meme extends Social {

	constructor(client, file, options = {}) {
		super(client, file, Object.assign(options, { guildOnly: true, cooldown: 10 }));
	}

	cmdVerify(message, args, loadingMessage) {
		const text = args.join(" ");
		if (!text.length) return Promise.reject(new this.client.methods.errors.UsageError("Debes escribir texto para este comando!", loadingMessage));
		return Promise.resolve(text);
	}

	async twoMeme(templateID, text, font = "impact", maxFontSize = "50px") {
		const params = this.getParams(templateID, font, maxFontSize);
		let text0;
		let text1;
		if (text.includes("; ")) {
			[text0, text1] = text.split("; ");
		} else {
			text0 = text;
			text1 = "";
		}
		params.append("text0", text0);
		params.append("text1", text1);

		const data = await fetch("https://api.imgflip.com/caption_image", { method: "POST", body: params })
			.then(res => res.json())
			.then(json => json.data);
		return data.url;
	}

	async fourMeme(templateID, text, font = "impact", maxFontSize = "50px") {
		const params = this.getParams(templateID, font, maxFontSize);
		let first;
		let second;
		let third;
		let forth;
		if (text.includes("; ")) {
			[first, second, third, forth] = text.split("; ");
		} else {
			first = text;
			second = "";
			third = "";
			forth = "";
		}
		params.append("boxes[0][text]", first);
		params.append("boxes[1][text]", second);
		params.append("boxes[2][text]", third);
		params.append("boxes[3][text]", forth);

		const data = await fetch("https://api.imgflip.com/caption_image", { method: "POST", body: params })
			.then(res => res.json())
			.then(json => json.data);
		return data.url;
	}

	getParams(templateID, font, maxFontSize) {
		const params = new URLSearchParams();
		params.append("template_id", templateID);
		params.append("username", IMGFLIP_USER);
		params.append("password", IMGFLIP_PASS);
		params.append("font", font);
		params.append("max_font_size", maxFontSize);
		return params;
	}

}

module.exports = Meme;
