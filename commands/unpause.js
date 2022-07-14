const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unpause')
        .setDescription('🎵 Unpause the current song'),

    async execute(client, interaction, cache, audio) {
        console.log("Ran " + interaction.commandName + " command");
        const serverQueue = cache.get(interaction.guild.id);

        let player = audio.get(interaction.guild.id);
        player.unpause();

        const emb = new MessageEmbed()
            .setAuthor({ name: "Unpaused the song, resuming...", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] })
    }

}