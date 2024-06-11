const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client({intents: [3276799]});

function startBot() {
    client.once('ready', () => {
        try {
            let guild = client.guilds.cache.get(config.server.id);
            console.log(`- Client: ${client.user.username} | Guild: ${guild.name}`);
        } catch (e) {
            console.log(`[BOT][GUILD ERROR] - Guild ID is invalid`);
        }
    });

    client.login(config.bot.token);
}

module.exports = {
    client,
    startBot
}