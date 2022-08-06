
const {
    MessageEmbed,
} = require('discord.js');

const playAPI = require('../src/functions/playSong');
const panelAPI = require('../src/functions/getControlPanel');
const vars = require('../variables.json');

const play = require('play-dl');
const autoplay = require('../commands/Music/autoplay');

module.exports = {
    async execute(client, interaction, cache, audio) {

        let serverQueue = cache.get(interaction.guild.id);
        let songs = serverQueue.songs;
        let song = serverQueue.songs[0];

        if (songs.length < 2 && autoplay == false) {
            const emb = new MessageEmbed()
                .setAuthor({ name: "There are not enough songs in the queue to run this command!", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)

            await interaction.editReply({ embeds: [emb] });
            return;
        }

        // skip to the next song in the queue
        serverQueue.songs.shift();
        if (songs.length > 0) {
            console.log("No more songs, checking for autoplay");
            if (serverQueue.autoplay == false) return;

            let songInfo = await play.video_info(song.related_videos[0]);
            let songInfo1 = await play.video_info(song.related_videos[1]);

            serverQueue.songs.push(songInfo);
            serverQueue.songs.push(songInfo1);
            await playAPI.playSong(client, interaction, cache, audio);

        } else if (autoplay == true) {
            
        }
    }

}