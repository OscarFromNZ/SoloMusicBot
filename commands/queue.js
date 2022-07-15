/*
    FILE INFORMATION
    All this file does is get the URL of the song, put it into an array and then send it over to playSong.js
    playSong.js is where all the magic happens
*/

const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');
const songsAPI = require('../src/functions/getSongs');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('🎵 Manage/view the current song queue!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('🎵 View the current song queue!')
                .addUserOption(option => option.setName('target').setDescription('The user')))

        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("🎵 Remove a song from the current song queue!")
                .addStringOption((option) =>
                    option
                        .setName('options')
                        .setDescription('Select an option.')
                        .setRequired(true)
                        .setAutocomplete(true))
                ),
        

    async execute(client, interaction, cache) {
        if (interaction.options.getSubcommand() === 'view') {
            const emb = new MessageEmbed()
                .setColor('2f3136');
        }
        if (interaction.options.getSubcommand() === 'remove') {
            const emb = new MessageEmbed()
                .setColor('2f3136');
        }
    }

}