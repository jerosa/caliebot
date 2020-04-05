const fetch = require("node-fetch");
const { TWITCH_TOKEN, TWITCH_SECRET } = process.env;
const { APIError } = require("./CustomError");

let accessToken;


class TwitchAPI {

    constructor() {
        throw new Error("This class may not be instantiated.");
    }

    static async setAccessToken(force) {
        if (!accessToken || force) {
            console.log("TwitchAPI: Updating accessToken");
            const params = new URLSearchParams();
            params.append("client_id", TWITCH_TOKEN);
            params.append("client_secret", TWITCH_SECRET);
            params.append("grant_type", "client_credentials");
            accessToken = await fetch("https://id.twitch.tv/oauth2/token", {
                method: "POST",
                body: params
            })
                .then(res => res.json())
                .then(json => json.access_token);
        }
    }

    static async getHelixData(url) {
        let count = 0;
        let data = null;
        let errorMsg;
        while (data === null && count < 3) {
            data = await fetch(url, {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` }
            })
                .then(res => res.json())
                .then(async json => {
                    if (json.status === 401) {
                        errorMsg = json;
                        return null;
                    }
                    return json.data[0];
                });
            if (data === null) await this.setAccessToken(true);
            count++;
        }
        if (data === null && count === 3) throw new APIError(`TwitchAPI: No se ha podido crear token (401) ${errorMsg.error}`);
        return data;
    }

    static getUserData(name) {
        return this.getHelixData(`https://api.twitch.tv/helix/users?login=${name}`);
    }

    static getStreamData(id) {
        return this.getHelixData(`https://api.twitch.tv/helix/streams?user_id=${id}`);
    }

    static async getGameData(id) {
        return this.getHelixData(`https://api.twitch.tv/helix/games?id=${id}`);
    }

}

module.exports = TwitchAPI;
