const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

// well, we need to join a voice channel soooo kinda need diss
const { joinVoiceChannel } = require('@discordjs/voice');

const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('🎵 Make me leave my current VC'),

    async execute(client, interaction, cache) {
        console.log("Ran " + interaction.commandName + " command");

    }

}