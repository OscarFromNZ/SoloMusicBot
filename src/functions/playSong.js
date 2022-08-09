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

const vars = require('../../variables.json');

module.exports = {
    async playSong(client, interaction, cache, audio) {
        console.log("\x1b[36m%s\x1b[0m", "Beginning playSong.js handler");
        let serverQueue = cache.get(interaction.guild.id);
        let connection = serverQueue.connection;
        //const connection = getVoiceConnection(interaction.guild.id);

        if (serverQueue.songs.length < 1) {
            const emb = new MessageEmbed()
                .setAuthor({ name: "I cannot find any songs in the queue to play!", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.followUp({ embeds: [emb], content: "🎶 **Tip:** Use </play:1005558358604009472> to queue a song" });
        }

        let songInfo = serverQueue.songs[0];
        if (typeof songInfo === 'undefined') {
            const emb = new MessageEmbed()
                .setAuthor({ name: "err", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.followUp({ embeds: [emb], content: "🎶 **Tip:** Use </play:1005558358604009472> to queue a song" });
        }
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

        var player = await this.getOrCreatePlayerForGuild(client, interaction, cache, audio);
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
    },

    async getOrCreatePlayerForGuild(client, interaction, cache, audio) {
        var serverQueue = cache.get(interaction.guild.id);
        var songInfo = serverQueue.songs[0];

        var player = audio.get(interaction.guild.id);

        if (!player) {
            player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause
                }
            });

            player.on(AudioPlayerStatus.Idle, async () => {
                console.log("\x1b[36m%s\x1b[0m", "AudioPlayerStatus is 'Idle'.");
    
                // Check if loop is set to true or not
                if (serverQueue.loop == true) {
                    // If the loop is true, play next song without shifting
                    if (serverQueue.songs.length > 0) {
                        await this.playSong(client, interaction, cache, audio);
                    } else {
                        console.log("No more songs");
                    }
    
                } else {
                    if (serverQueue.songs.length > 1) {
                        console.log(": Song length is more than 1");
                        serverQueue.songs.shift();
                        cache.set(interaction.guild.id, serverQueue);
                        await this.playSong(client, interaction, cache, audio);
    
                    } else {
                        console.log(": Song length is not than 1");
                        serverQueue.songs.shift();
    
                        console.log("No more songs, checking for autoplay");
                        if (serverQueue.autoplay == false) {
                            console.log("Autoplay is off");
    
                        } else {
    
                            let song = await play.video_info(songInfo.related_videos[0]);
    
                            serverQueue.songs.push(song);
        
                            cache.set(interaction.guild.id, serverQueue);
                            await this.playSong(client, interaction, cache, audio);
                            
                        }
    
                    }
                }
    
            });

        }

        return player;
    }

}


