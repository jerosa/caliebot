const Sequelize = require("sequelize");
const { DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT } = process.env;

class Database {

    constructor(client) {
        this.client = client;

        this.db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
            host: DB_HOST,
            port: DB_PORT,
            dialect: "postgres",
            logging: false
        });

        this.settings = this.db.define("settings", this.settingsSchema);
        this.points = this.db.define("points", this.pointsSchema);
        this.twitch = this.db.define("twitch", this.twitchSchema);
    }

    async _ready() {
        await this.db.authenticate()
            .then(() => this.client.console.log("[DATABASE]: Connection has been established successfully."))
            .then(() => this.db.sync()
                .then(() => this.client.console.log("[DATABASE]: Done Synchronizing database!"))
                .catch(error => this.client.console.error(`[DATABASE]: Error synchronizing the database: \n${error}`))
            ).catch(error => {
                this.client.console.error(`[DATABASE]: Unable to connect to the database: \n${error}`);
                this.client.console.log("[DATABASE]: Try reconnecting in 10 seconds...");
                setTimeout(() => this._ready(), 10000);
            });
    }

    get settingsSchema() {
        return {
            // This is the guild ID, it's unique.
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            prefix: {
                type: Sequelize.STRING,
                defaultValue: "!",
                allowNull: false
            },
            // The name of the muted role
            mutedRole: {
                type: Sequelize.STRING,
                defaultValue: "Muted",
                allowNull: false
            },
            // The name of the muted channel voice
            mutedChannel: {
                type: Sequelize.STRING,
                defaultValue: "Muted Channel",
                allowNull: false
            },
            // The name of the Moderator role.
            modRole: {
                type: Sequelize.STRING,
                defaultValue: "Moderator",
                allowNull: false
            },
            // The name of the Administrator role.
            adminRole: {
                type: Sequelize.STRING,
                defaultValue: "Administrator",
                allowNull: false
            },
            // The name of the Subscribers role
            subRole: {
                type: Sequelize.STRING,
                defaultValue: "Subscriber",
                allowNull: false
            },
            // Check if wanted to kick not subscribers
            kickNotSubs: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            logging: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            loggingChannel: {
                type: Sequelize.STRING,
                defaultValue: "logs",
                allowNull: false
            },
            // This is like if a user attempts to use a command they're not allowed, for example a regular member tries to use eval.
            systemNotice: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            // Welcome messages
            welcomeEnabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            // Where to post the welcome messages.
            welcomeChannel: {
                type: Sequelize.STRING,
                defaultValue: "welcome",
                allowNull: false
            },
            // What kind of welcome message is it? is it an image? is it text?
            welcomeType: {
                type: Sequelize.STRING,
                defaultValue: "text",
                allowNull: false
            },
            rulesChannel: {
                type: Sequelize.STRING,
                defaultValue: "text",
                allowNull: false
            },
            twitchChannel: {
                type: Sequelize.STRING,
                defaultValue: "twitch",
                allowNull: false
            },
            // The entire economy system
            socialSystem: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            // Level up messages
            levelNotice: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            // Guild Member inventories
            socialInventory: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            // Guild stores, where you can buy tokens and roles.
            socialStore: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            // Is the daily command enabled?
            dailyEnabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            // How many hours between claiming dailies?
            dailyTime: {
                type: Sequelize.INTEGER,
                defaultValue: 24,
                allowNull: false
            },
            // How many points you can get for your daily.
            dailyPoints: {
                type: Sequelize.INTEGER,
                defaultValue: 250,
                allowNull: false
            },
            // This allows users to earn just by chatting.
            chatEarningEnabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            // The lowest amount of points you can earn.
            minPoints: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
            // The highest amount of points you can earn.
            maxPoints: {
                type: Sequelize.INTEGER,
                defaultValue: 20,
                allowNull: false
            },
            // Do you pay for commands?
            commandPaying: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        };
    }

    get pointsSchema() {
        return {
            // Unique ID created by combining the guild id and user id `${guild.id}-${user.id}`
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            // How many points the member has earned.
            points: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            // What level the member is.
            level: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            // User ID
            user: {
                type: Sequelize.STRING,
                allowNull: false
            },
            // Guild ID
            guild: {
                type: Sequelize.STRING,
                allowNull: false
            },
            // This is a timestamp of when they claimed their daily.
            daily: {
                type: Sequelize.DATE,
                defaultValue: 0,
                allowNull: false
            }
        };
    }

    get twitchSchema() {
        return {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false
            },
            profileImage: {
                type: Sequelize.STRING,
                allowNull: false
            },
            live: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            guilds: {
                type: Sequelize.ARRAY(Sequelize.STRING), // eslint-disable-line new-cap
                defaultValue: []
            }
        };
    }

}

module.exports = Database;
