const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('🎵 View information of the current song'),

    async execute(client, interaction, cache) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");
        const serverQueue = cache.get(interaction.guild.id);
        const songs = serverQueue.songs;

        if (!songs[0]) {
            const emb = new MessageEmbed()
                .setAuthor({ name: "I am not playing any songs right now", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] });
        }

        const emb = new MessageEmbed()
            .setAuthor({ name: "I am currently playing \"" + songs[0].video_details.title + "\" by " + songs[0].video_details.channel, iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.editReply({ embeds: [emb] });
    }

}