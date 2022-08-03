const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency'),

    async execute(client, interaction, cache) {
        const emb = new MessageEmbed()
            .setAuthor({ name: `Latency is ${Date.now() - interaction.createdTimestamp}ms & API Latency is ${Math.round(client.ws.ping)}ms`, iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] })
    }

}