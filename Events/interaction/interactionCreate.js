module.exports = async (client, interaction) => {
	try {

	    if(interaction.isCommand()) {
	    	const color = client.config.server.embed
			const cmd = client.commands.get(interaction.commandName)
			if(cmd) await cmd.execute(client, interaction, color)
		}

	} catch (e) {
		console.log(`[BOT ERROR][COMMAND0 - ${e}]`)
	}
}