const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('🎵 Pause the current song'),

    async execute(client, interaction, cache, audio) {
        console.log("Ran " + interaction.commandName + " command");
        const serverQueue = cache.get(interaction.guild.id);

        if (!interaction.member.voice.channel) {
            let emb = new MessageEmbed()
                .setAuthor({ name: "You need to be in a voice channel to run this command", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] })
            return;
        }

        try {
            let player = audio.get(interaction.guild.id);
            player.pause();
        } catch (err) {
            console.log(err)
        }

        const emb = new MessageEmbed()
            .setAuthor({ name: "Paused the song, to unpause, run /unpause", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] });
    }

}