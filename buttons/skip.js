
const {
    MessageEmbed,
} = require('discord.js');

const playAPI = require('../src/functions/playSong');
const panelAPI = require('../src/functions/getControlPanel');
const vars = require('../variables.json');

module.exports = {
    async execute(client, interaction, cache) {
        interaction.deferReply();
        let serverQueue = cache.get(interaction.guild.id);
        // skip to the next song in the queue
        serverQueue.songs.shift();

        // getting song info
        let songInfo = serverQueue.songs[0];

        await playAPI.playSong(client, interaction, cache); // Calling the function to actually play the song

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