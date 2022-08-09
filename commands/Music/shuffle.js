const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const playAPI = require('../../src/functions/playSong');
const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('🎵 Shuffle the song queue!'),

    async execute(client, interaction, cache, audio) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");

        let player = audio.get(interaction.guild.id);
        await player.pause();

        // Getting songs/queue
        const serverQueue = cache.get(interaction.guild.id);
        const songs = serverQueue.songs;

        // Shuffling
        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }

        // Sending messsage
        let emb = new MessageEmbed()
            .setAuthor({ name: "I have shuffled the queue, now playing \"" + songs[0].video_details.title + "\"", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.editReply({ embeds: [emb] });

        await player.unpause();
        await playAPI.playSong(client, interaction, cache, audio);
    }

}