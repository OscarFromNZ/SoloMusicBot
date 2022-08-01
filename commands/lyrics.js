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

    }

}