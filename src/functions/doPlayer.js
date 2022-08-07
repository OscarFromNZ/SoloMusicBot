const { createAudioPlayer, createAudioResource, StreamType, demuxProbe, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
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
                        module.exports.playSong(client, interaction, cache, audio);
                    } else {
                        console.log("No more songs");
                    }
    
                } else {
                    if (serverQueue.songs.length > 1) {
                        console.log(": Song length is more than 1");
                        serverQueue.songs.shift();
                        cache.set(interaction.guild.id, serverQueue);
                        module.exports.playSong(client, interaction, cache, audio);
    
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
                            await module.exports.playSong(client, interaction, cache, audio);
                            
                        }
    
                    }
                }
    
            });

        }

        return player;
    }
    
}