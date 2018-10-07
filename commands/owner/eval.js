const Owner = require("../../lib/structures/Owner.js");
const { inspect } = require("util");
const fetch = require("node-fetch");

class Eval extends Owner {

    constructor(...args) {
        super(...args, {
            name: "eval",
            description: "Evaluates arbitrary Javascript.",
            category: "Owner",
            usage: "eval <expression>",
            aliases: ["ev"]
        });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const { clean, client } = this;
        const code = args.join(" ");
        const token = client.token.split("").join("[^]{0,2}");
        const rev = client.token.split("").reverse().join("[^]{0,2}");
        const filter = new RegExp(`${token}|${rev}`, "g");
        try {
            let output = eval(code);
            if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
            output = inspect(output, { depth: 0, maxArrayLength: null });
            output = output.replace(filter, "[TOKEN]");
            output = clean(output);
            if (output.length < 1950) {
                return message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
            } else {
                try {
                    const body = await fetch("https://www.hastebin.com/documents", { method: "POST", body: output })
                        .then(res => res.json())
                        .then(json => json.body);
                    return message.channel.send(`Output was to long so it was uploaded to hastebin https://www.hastebin.com/${body.key}.js `);
                } catch (error) {
                    return message.channel.send(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
                }
            }
        } catch (error) {
            return message.channel.send(`The following error occured \`\`\`js\n${error.stack}\`\`\``);
        }
    }

    clean(text) {
        return text
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`);
    }

}

module.exports = Eval;
