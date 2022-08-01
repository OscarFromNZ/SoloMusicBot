const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('🎵 Get the lyrics of the current song!'),

    async execute(client, interaction, cache) {
        if (!interaction.member.voice.channel) {
            let emb = new MessageEmbed()
                .setAuthor({ name: "You need to be in a voice channel to run this command", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] })
            return;
        }
    }

}