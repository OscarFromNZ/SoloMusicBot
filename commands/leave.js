const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

// well, we need to join a voice channel soooo kinda need diss
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('🎵 Make me leave my current VC'),

    async execute(client, interaction, cache) {
        console.log("Ran " + interaction.commandName + " command");
        const serverQueue = cache.get(interaction.guild.id);

        if ( !connection ) {
            console.log("No connection found");
            const connection = getVoiceConnection(interaction.guild.id);
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