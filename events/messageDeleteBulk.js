const Event = require("../lib/structures/Event.js");

module.exports = class extends Event {

    async run(messages) {
        const { guild } = messages.first();
        if (!guild) return;
        this.client.emit("customLog", messages.first().guild, "msgBulkDelete", { channel: messages.first().channel, name: "messages", count: messages.size });
    }

};
