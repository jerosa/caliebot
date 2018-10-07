const config = {
    // Bot Owner, level 10 by default. You no longer need to supply the owner ID, as the bot
    // will pull this information directly from it's application page.

    // Bot Admins, level 9 by default. Array of user ID strings.
    admins: ["168124895320866817"],

    // Bot Support, level 8 by default. Array of user ID strings
    support: [],

    // Default per-server settings.
    defaultSettings: {
        prefix: "!",
        mutedRole: "Muted",
        mutedChannel: "Muted Channel",
        modRole: "Moderator",
        adminRole: "Administrator",
        systemNotice: true,
        welcomeEnabled: false,
        welcomeChannel: "welcome",
        welcomeType: "text",
        twitchChannel: "twitch",
        socialSystem: false,
        levelNotice: false,
        socialInventory: false,
        socialStore: false,
        dailyEnabled: true,
        dailyTime: 24,
        dailyPoints: 20,
        chatEarningEnabled: false,
        minPoints: 1,
        maxPoints: 20,
        commandPaying: false
    },

    // PERMISSION LEVEL DEFINITIONS.

    permLevels: [
        // This is the lowest permisison level, this is for non-roled users.
        {
            level: 0,
            name: "User",
            // Don't bother checking, just return true which allows them to execute any command their
            // level allows them to.
            check: () => true
        },

        // This is your permission level, the staff levels should always be above the rest of the roles.
        {
            level: 2,
            // This is the name of the role.
            name: "Moderator",
            // The following lines check the guild the message came from for the roles.
            // Then it checks if the member that authored the message has the role.
            // If they do return true, which will allow them to execute the command in question.
            // If they don't then return false, which will prevent them from executing the command.
            check: (message, target) => {
                try {
                    const modRole = message.guild.roles.find(role => role.name.toLowerCase() === message.settings.modRole.toLowerCase());
                    if (modRole) {
                        if (target) return target.roles.has(modRole.id);
                        return message.member.roles.has(modRole.id);
                    }
                    return false;
                } catch (ex) {
                    return false;
                }
            }
        },

        {
            level: 3,
            name: "Administrator",
            check: (message, target) => {
                try {
                    const adminRole = message.guild.roles.find(role => role.name.toLowerCase() === message.settings.adminRole.toLowerCase());
                    if (adminRole) {
                        if (target) return target.roles.has(adminRole.id);
                        return message.member.roles.has(adminRole.id);
                    }
                    return false;
                } catch (ex) {
                    return false;
                }
            }
        },
        // This is the server owner.
        {
            level: 4,
            name: "Server Owner",
            // Simple check, if the guild owner id matches the message author's ID, then it will return true.
            // Otherwise it will return false.
            check: (message, target) => {
                if (message.channel.type === "text") {
                    if (target) return message.guild.owner.user.id === target.user.id;
                    else return message.guild.owner.user.id === message.author.id;
                }
                return false;
            }
        },

        // Bot Support is a special inbetween level that has the equivalent of server owner access
        // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
        {
            level: 8,
            name: "Bot Support",
            // The check is by reading if an ID is part of this array. Yes, this means you need to
            // change this and reboot the bot to add a support user. Make it better yourself!
            check: (message, target) => target ? config.admins.includes(target.user.id) : config.support.includes(message.author.id)
        },

        // Bot Admin has some limited access like rebooting the bot or reloading commands.
        {
            level: 9,
            name: "Bot Admin",
            check: (message, target) => target ? config.admins.includes(target.user.id) : config.admins.includes(message.author.id)
        },

        // This is the bot owner, this should be the highest permission level available.
        // The reason this should be the highest level is because of dangerous commands such as eval
        // or exec (if the owner has that).
        {
            level: 10,
            name: "Bot Owner",
            // Compares the message author id to the one stored in the application page.
            check: (message, target) => target ? target.user.id === message.client.appInfo.owner.id : message.client.appInfo.owner.id === message.author.id
        }
    ]
};

module.exports = config;
