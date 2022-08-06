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
        interaction.deferReply();

        let serverQueue = cache.get(interaction.guild.id);

        // This is actually the same as the songInfo object as declared belows
        let song = serverQueue.songs[0];

        // skip to the next song in the queue
        serverQueue.songs.shift();
        if (!serverQueue.songs.length > 0) {
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
            await playAPI.playSong(client, interaction, cache, audio); 
        }

        // Getting song info, this is the same as the song variable above
        let songInfo = serverQueue.songs[0];

        await playAPI.playSong(client, interaction, cache, audio); // Calling the function to actually play the song

        // getting control p details
        let controlPanel = await panelAPI.getPanel(client, interaction, cache, songInfo);
        let emb1 = controlPanel[0];
        let button = controlPanel[1];
        let button1 = controlPanel[2];

        const emb = new MessageEmbed()
            .setAuthor({ name: "Skipped old song, now playing: \"" + songInfo.video_details.title + "\"", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)

        await interaction.editReply({ embeds: [emb, emb1], components: [button, button1] });
    }

}