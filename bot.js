const Discord = require('discord.js');
const client = new Discord.Client({intents: [3276799]});
const fs = require('fs');

// CONFIG
client.config = require("./config.json")
client.author = "@mrcyci6"
client.commands = new Discord.Collection()
client.command = []

// EVENTS & COMMANDS HANDLER
const loadSlashCommands = (dir = "./SlashCommands") => {
    fs.readdirSync(dir).forEach(dirs => {
    	const commands = fs.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
  
      	for (const file of commands) {
	        const getFileName = require(`${dir}/${dirs}/${file}`)
	        client.commands.set(getFileName.data.name, getFileName);
	    	client.command.push(getFileName.data.toJSON())
	     	console.log(`>>> commande : ${getFileName.data.name} [${dirs}]`)
  		}
    })
}

const loadEvents = (dir = "./Events") => {
    fs.readdirSync(dir).forEach(dirs => {
	    const events = fs.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
	  
	    for (const event of events) {
	        const evt = require(`${dir}/${dirs}/${event}`);
	        const evtName = event.split(".")[0];
	        client.on(evtName, evt.bind(null, client));
	        console.log(`>>> event : ${evtName} [${dirs}]`)
      	}
    })
}

function startBot() {
    loadEvents();
    loadSlashCommands();
    client.login(client.config.bot.token);
}

module.exports = {
    client,
    startBot
}