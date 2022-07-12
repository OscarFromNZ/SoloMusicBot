const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');
const connectionAPI = require("../src/functions/getConnection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('🎵 Make me leave my current VC'),

    async execute(client, interaction, cache) {
        console.log("Ran " + interaction.commandName + " command");
        const serverQueue = cache.get(interaction.guild.id);

        if ( !connection ) {
            const connection = await connectionAPI.getConnection(client, interaction, cache);
            console.log("New connection is " + connection);
            serverQueue.connection = connection;
            cache.set(interaction.guild.id, serverQueue);
        }

        const connection = serverQueue.connection;
        connection.destroy();

        const emb = new MessageEmbed()
            .setAuthor({ name: "Left the voice channel, run the /join command to rejoin", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/WtsHhYqXYZ' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] })
    }

}