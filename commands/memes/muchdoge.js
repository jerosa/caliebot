const Meme = require("../../lib/structures/Meme.js");

class MuchDoge extends Meme {

    constructor(...args) {
        super(...args, {
            name: "muchdoge",
            description: "¡El Doge!",
            usage: "muchdoge <primer texto ; segundo texto; tercer texto; cuarto texto>",
            category: "meme",
            cost: 5,
            loadingString: "**{{displayName}}** quiere un doge...",
            aliases: ["mdoge"]
        });
    }

    async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
        const text = await this.cmdVerify(message, args, loadingMessage);
        const meme = await this.fourMeme(8072285, text);
        await loadingMessage.edit({
            embed: {
                title: "Clic aquí si la imagen falla en cargar.",
                url: meme,
                color: message.guild ? message.guild.me.roles.highest.color : 5198940,
                image: { url: meme },
                footer: {
                    icon_url: message.author.displayAvatarURL(), // eslint-disable-line camelcase
                    text: `Pedido por ${message.member.displayName}`
                }
            }
        });
    }

}
module.exports = MuchDoge;
