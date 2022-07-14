const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed, Permissions,
} = require('discord.js');

// well, we need to join a voice channel soooo kinda need diss
const { joinVoiceChannel } = require('@discordjs/voice');

const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('🎵 Skip to the next song in the queue!'),

    async execute(client, interaction, cache) {
        
    }

}