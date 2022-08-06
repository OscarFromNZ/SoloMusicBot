const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const playAPI = require('../../src/functions/playSong');
const play = require('play-dl');
const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('🎵 Skip to the next song in the queue!'),

    async execute(client, interaction, cache, audio) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");
        var serverQueue = cache.get(interaction.guild.id);
        var songs = serverQueue.songs;

        if (songs.length < 2) {
            const emb = new MessageEmbed()
                .setAuthor({ name: "There are not enough songs in the queue!", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)

            await interaction.reply({ embeds: [emb], content: "🎶 **Tip:** Use </play:1005558358604009472> to queue another song!" });
            return;
        }

        // skip to the next song in the queue and play it
        serverQueue.songs.shift();
        cache.set(interaction.guild.id, serverQueue);
        await playAPI.playSong(client, interaction, cache, audio); // Calling the function to actually play the song

    }

}