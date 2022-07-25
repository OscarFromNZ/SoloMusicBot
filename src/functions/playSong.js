/*
    Where the magic happens
    This is where we do all of that backend stuff
    Setting a player, subscribing the connection, **playing the song**

   We also handle autoplay stuff here just to make things more confusing ;)
*/

const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const { createAudioPlayer, createAudioResource, StreamType, demuxProbe, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl');

const panelAPI = require('./getControlPanel');

module.exports = {
    async playSong(client, interaction, cache, audio) {
        if (!audio) {
            audio = new Map();
        }
        let serverQueue = cache.get(interaction.guild.id);
        let connection = serverQueue.connection;

        let song = serverQueue.songs[0];
        let url = song.video_details.url;
        console.log(song);

        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });
        // 
        audio.set(interaction.guild.id, player);
        // 
        console.log("Player initialized and ready");

        let source = await play.stream(url);
        console.log("Stream initialized and ready");

        let resource = createAudioResource(source.stream, {
            inputType: source.type
        })
        console.log("Resource initialized and ready");

        player.play(resource);
        console.log("Playing resource via player");

        await connection.subscribe(player);
        console.log("Connection subscribed, playing " + url);

        player.on('channelEmpty', () => {
            console.log("Channel Empty --> ");
            connection.destroy();
            serverQueue.delete(interaction.guild.id);
        });

        player.on(AudioPlayerStatus.Idle, async () => {
            console.log("Audio status is idle");
            //var serverQueue = cache.get(player.guild.id);
            console.log(serverQueue.loop);

            // Check if loop is set to true or not
            if (serverQueue.loop == true) {
                // If the loop is true, play next song without shifting
                if (serverQueue.songs.length > 0) {
                    module.exports.playSong(client, interaction, cache);
                } else {
                    console.log("No more songs");
                }
            } else {
                // Assuming loop is set to false
                // Going to next song in queue
                serverQueue.songs.shift();
                // Playing the song
                if (serverQueue.songs.length > 0) {
                    module.exports.playSong(client, interaction, cache);
                } else {
                    console.log("No more songs, checking for autoplay");

                    if (serverQueue.autoplay == false) return console.log("Autoplay is off");
                    // If autoplay is on -->
                    let songInfo = await play.video_info(song.related_videos[0]);
                    let songInfo1 = await play.video_info(song.related_videos[1]);

                    let controlPanel = await panelAPI.getPanel(client, interaction, cache, songInfo);
                    let emb1 = controlPanel[0];
                    let button = controlPanel[1];
                    let button1 = controlPanel[2];

                    const emb = new MessageEmbed()
                        .setAuthor({ name: "Now playing: \"" + songInfo.video_details.title + "\"", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                        .setColor("#03fc6b")

                    await interaction.editReply({ embeds: [emb, emb1], components: [button, button1], content: "🎶 Since `autoplay` is toggled to **'on'** in this guild, I am now playing **" + songInfo.video_details.title + "**\nMy autoplay formula can be quite bad, run `/autoplay off` to disable autoplay" });

                    // Autoplay
                    serverQueue.songs.push(songInfo);
                    serverQueue.songs.push(songInfo1);
                    module.exports.playSong(client, interaction, cache);
                }
            }
        });

        player.on('error', (error) => console.error(error));

    }
}


