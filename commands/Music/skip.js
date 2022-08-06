const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const playAPI = require('../../src/functions/playSong');
const panelAPI = require('../../src/functions/getControlPanel');
const vars = require('../../variables.json');

const play = require('play-dl');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('🎵 Skip to the next song in the queue!'),

    async execute(client, interaction, cache, audio) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");

        let serverQueue = cache.get(interaction.guild.id);
        let song = serverQueue.songs[0];

        // skip to the next song in the queue
        serverQueue.songs.shift();
        if (!serverQueue.songs.length > 0) {
            console.log("No more songs, checking for autoplay");

            if (serverQueue.autoplay == false) return console.log("Autoplay is off");
            // If autoplay is on -->
            let songInfo = await play.video_info(song.related_videos[0]);

            // Autoplay
            serverQueue.songs.push(songInfo);
            await playAPI.playSong(client, interaction, cache, audio); 
        }

        await playAPI.playSong(client, interaction, cache, audio); // Calling the function to actually play the song

    }

}