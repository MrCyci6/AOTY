const Discord = require('discord.js');
const fs = require('fs');
const licences = require('../../storage/licences.json');

module.exports = async (client) => {

    try {

        // SLASHCOMMANDS
        let guild = client.guilds.cache.get(client.config.server.id);
        await guild.commands.set(client.command)
        
        // ACTIVITY
        client.user.setActivity(`https://aoty.me/`, { type: Discord.ActivityType.Watching });

        // READY
        console.log(`- Connecté : ${client.user.username} | Serveur principal : ${guild.name}`)
        console.log(`- Invitation : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
        console.log(`- Made by ${client.author} with <3`)

        // LICENCES
        setInterval(() => {
            for(let licence in licences) {
                let currentDate = new Date();
                let expireDate = new Date(licences[licence].expire);

                if(currentDate > expireDate) {

                    let member = guild.members.cache.get(licences[licence].id);
                    if(member) {
                        member.roles.remove(client.config.roles.customer);
                        try {
                            member.send(`Ta licence AOTY vient de se terminer.`);
                        } catch (e) {}
                    }

                    client.config.owners.forEach(id => {
                        let owner = guild.members.cache.get(id);
                        if(owner) {
                            owner.send(`La licence de ${member.user.username} vient de se terminer.`);
                        }
                    });

                    if(licences.hasOwnProperty(licence)) {
                        delete licences[licence];
                        let newLicences = JSON.stringify(licences, null, 2);
                        fs.writeFileSync('./storage/licences.json', newLicences);
                    }

                    console.log(`[LOG] - La licence ${licence} a expirée.`);
                }
            }

        }, 5000);
    } catch (e) {
        console.log(`[BOT][GUILD ERROR] - Guild ID is invalid`);
    }
}