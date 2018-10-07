const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", GuildMember => class extends GuildMember {

    get fullId() {
        return `${this.guild.id}-${this.id}`;
    }

    get score() {
        return this.client.getPoints(this.fullId, this.id, this.guild.id);
    }

    async givePoints(profile, points) {
        profile.points += points;
        return await this.client.writePoints(this.fullId, profile);
    }

    async takePoints(profile, points) {
        profile.points -= points;
        return await this.client.writePoints(this.fullId, profile);
    }

    setLevel(level) {
        this.score.level = level;
        return this.client.points.set(this.fullId, this.score);
    }

});
