const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js')
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('licence')
    .setDescription('Gère les licences.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('generate')
        .setDescription('Génère une licence.')
        .addStringOption(option =>
          option
            .setName('time')
            .setDescription('Durée de la licence (Exemple: 2min, 2hour, 2day, 2month, 2year, lifetime)')
            .setRequired(true)
        )
        .addUserOption(option =>
          option
            .setName('member')
            .setDescription('Membre à qui attribuer la licence')
            .setRequired(true)
        )
    ),
  
  async execute(client, interaction, color) {
        let subCommand = interaction.options.getSubcommand();
        let author = interaction.guild.members.cache.get(interaction.user.id)

        if (subCommand === 'generate') {
            if(client.config.owners.includes(interaction.user.id)) {

                let time = interaction.options.getString('time');
                let user = interaction.options.getUser('member');

                if(time == "lifetime" || /^\d+(min|hour|day|month|year)$/.test(time)) {
                    try {

                        let member = interaction.guild.members.cache.get(user.id);
                        let generatedLicense = await generateUniqueLicence(time, member.user.id);

                        const embed = new Discord.EmbedBuilder()
                            .setTitle(`Licence AOTY activée`)
                            .setURL(`https://aoty.me/discord`)
                            .setColor(color)
                            .setDescription(`Votre licence est activée jusqu'au ${generatedLicense.plan.expire}, ne la communiquez à personne. \`${generatedLicense.message}\``)

                        member.roles.add(client.config.roles.customer);

                        try {
                            member.send({embeds: [embed]})
                            interaction.reply({content: `Licence \`${generatedLicense.message}\` envoyé au membre en message privé`, ephemeral: true});
                        } catch (e) {
                            interaction.reply({content: `Le membre n'accepte probablement pas les messages privés, voici la licence ${generatedLicense.message}`, ephemeral: true});
                        }
                    } catch (e) {
                        console.log(e);
                        interaction.reply({content: 'Impossible de générer une licence', ephemeral: true});
                    }
                } else {
                    interaction.reply({content: `Durée de la licence invalide, (Exemple: 2min, 2hour, 2day, 2month, 2year)`, ephemeral: true})
                }
            } else {
                interaction.reply({content: client.config.messages.noperm, ephemeral: true})
            }

        }
    }
}

const licences = require('../../storage/licences.json');

function getLicenceInfo(licence) {
    for(let name in licences) {
        if(name == licence) return {status: 200, message: `Informations sur ${licence}`, data: licences[name]};
    }
    return {status: 204, message: `La licence spécifiée n'existe pas`};
}

async function generateUniqueLicence(plan, id) {
    while (true) {
        let generatedLicense = "aoty-" + generateRandomString();
        if (getLicenceInfo(generatedLicense).status == 204) {
            
            let expireDate = "";  
            if(plan == "lifetime") {
                expireDate = convertToISODate("99year");
            } else if(/^\d+(min|hour|day|month|year)$/.test(plan)) {
                expireDate = convertToISODate(plan);
            } else {
                expireDate = convertToISODate("1day")
            }
            
            let currentDate = new Date();
            let data = {
                id: id,
                expire: expireDate,
                since: currentDate
            }

            licences[generatedLicense] = data;

            try {
                let newLicences = JSON.stringify(licences, null, 2);
                fs.writeFileSync('./storage/licences.json', newLicences);
                return {status: 200, message: `${generatedLicense}`, plan: data};
            } catch (e) {
                console.log(`[ERROR] - ${e}`)
                return {status: 500, message: `Erreur lors de l'ajout de la licence`}
            }
        }
    }
}

function generateRandomString() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function convertToISODate(value) {
    if(value == "lifetime") return "lifetime";
    let unit = value.split("").filter(c => { return isNaN(c) }).join("");
    let amount = parseInt(value);

    let date = new Date();
    switch(unit) {
        case 'min':
            date.setMinutes(date.getMinutes() + amount);
            break;
        case 'hour':
            date.setHours(date.getHours() + amount);
            break;
        case 'day':
            date.setDate(date.getDate() + amount);
            break;
        case 'month':
            date.setMonth(date.getMonth() + amount);
            break;
        case 'year':
            date.setFullYear(date.getFullYear() + amount);
            break;
        default:
            return null;
    }

    return date.toISOString();
}