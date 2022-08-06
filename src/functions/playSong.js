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
        let serverQueue = cache.get(interaction.guild.id);
        let connection = serverQueue.connection;
        //const connection = getVoiceConnection(interaction.guild.id);

        let songInfo = serverQueue.songs[0];
        let url = songInfo.video_details.url;


        let controlPanel = await panelAPI.getPanel(client, interaction, cache, songInfo);

        const emb = new MessageEmbed()
            .setAuthor({ name: "Now playing: \"" + songInfo.video_details.title + "\"", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor("#03fc6b")

        await interaction.channel.send({ embeds: [emb] });
        await interaction.channel.send(controlPanel);


        var player = audio.get(interaction.guild.id)

        if (!player) {
            console.log("createAudioPlayer");
            player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause
                }
            });
        }

        audio.set(interaction.guild.id, player);

        console.log("Player initialized and ready");

        let source = await play.stream(url);
        console.log("Stream initialized and ready");

        let resource = createAudioResource(source.stream, {
            inputType: source.type
        });

        console.log("Resource initialized and ready");

        player.play(resource);
        console.log("Playing resource via player");

        connection.subscribe(player);
        console.log("Connection subscribed, playing " + url);

        player.on(AudioPlayerStatus.Idle, async () => {
            console.log("Audio status is idle");

            // Check if loop is set to true or not
            if (serverQueue.loop == true) {
                // If the loop is true, play next song without shifting
                if (serverQueue.songs.length > 0) {
                    module.exports.playSong(client, interaction, cache, audio);
                } else {
                    console.log("No more songs");
                }

            } else {
                if (serverQueue.songs.length > 1) {
                    serverQueue.songs.shift();
                    module.exports.playSong(client, interaction, cache, audio);

                } else {
                    serverQueue.songs.shift();

                    console.log("No more songs, checking for autoplay");
                    if (serverQueue.autoplay == false) return;

                    let song = await play.video_info(songInfo.related_videos[0]);

                    serverQueue.songs.push(song);
                    await playAPI.playSong(client, interaction, cache, audio);

                }
            }
        });

        player.on('error', (error) => console.error(error));

        player.on(AudioPlayerStatus.Paused, () => {
            console.log("Player paused")
        });
    }
}


