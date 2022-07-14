/*
    Where the magic happens
    This is where we do all of that backend stuff
    Setting a player, subscribing the connection, **playing the song**

    ++ need to add events
*/

const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const { createAudioPlayer, createAudioResource, StreamType, demuxProbe, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
    async playSong(client, interaction, cache, audio) {
        if ( !audio ) {
            audio = new Map();
        }
        let serverQueue = cache.get(interaction.guild.id);
        let connection = serverQueue.connection;

        let song = serverQueue.songs[0];
        let url = song.video_details.url;

        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });
        console.log("Player initialized and ready");

        let source = await play.stream(url);
        console.log("Stream initialized and ready");

        let resource = createAudioResource(source.stream, {
            inputType: source.type
        })
        console.log("Resource initialized and ready");

        player.play(resource);
        console.log("Playing resource via player");

        // 
        audio.set(interaction.guild.id, player);
        // 

        await connection.subscribe(player);
        console.log("Connection subscribed, playing " + url);

        player.on('channelEmpty', () => {
            console.log("Channel Empty --> ");
            connection.destroy();
            serverQueue.delete(interaction.guild.id);
        });
    
        player.on(AudioPlayerStatus.Idle, () => {
            console.log("Audio status is idle");

            // Check if loop is set to true or not
            if (serverQueue.loop = true) {
                // If the loop is true, play next song without shifting
                if (serverQueue.songs.length > 0) {
                    module.exports.playSong(client, interaction, cache);
                } else {
                    console.log("No more songs");
                }
                return;
            }
            
            // Assuming loop is set to false
            // Going to next song in queue
            serverQueue.songs.shift();
            // Playing the song
            if (serverQueue.songs.length > 0) {
                module.exports.playSong(client, interaction, cache);
            } else {
                console.log("No more songs");
            }
        });

        player.on('error', (error) => console.error(error));

    }
}