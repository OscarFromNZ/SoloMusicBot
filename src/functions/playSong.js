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
const tipsAPI = require('./getTip');
const playerAPI = require('./doPlayer');

module.exports = {
    async playSong(client, interaction, cache, audio) {
        console.log("\x1b[36m%s\x1b[0m", "Beginning playSong.js handler");
        let serverQueue = cache.get(interaction.guild.id);
        let connection = serverQueue.connection;
        //const connection = getVoiceConnection(interaction.guild.id);

        let songInfo = serverQueue.songs[0];
        let url = songInfo.video_details.url;

        let controlPanel = await panelAPI.getPanel(client, interaction, cache, songInfo);
        let tip = await tipsAPI.getTip(client, interaction, cache);

        const emb = new MessageEmbed()
        .setAuthor({ name: "Now playing: \"" + songInfo.video_details.title + "\"", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
        .setColor("#03fc6b")

        if (interaction.replied) {
            console.log("Interaction has already been replied");
            await interaction.channel.send({ embeds: [emb], content: tip });
        } else if (interaction.deferred) {
            console.log("Interaction has already been deferred");
            await interaction.editReply({ embeds: [emb], content: tip });
        } else {
            console.log("Interaction has not been replied or deferred");
            await interaction.reply({ embeds: [emb], content: tip });
        }

        await interaction.channel.send(controlPanel);

        var player = await playerAPI.getOrCreatePlayerForGuild(client, interaction, cache, audio);
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

        /*
        player.on('error', (error) => console.error(error));

        player.on(AudioPlayerStatus.Paused, () => {
            console.log("Audio paused")
        });
        */
    }
}


