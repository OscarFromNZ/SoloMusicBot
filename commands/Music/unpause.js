const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unpause')
        .setDescription('🎵 Unpause the current song'),

    async execute(client, interaction, cache, audio) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");

        try {
            var player = audio.get(interaction.guild.id);
            player.unpause();
        } catch (err) {
            console.log(err)
        }

        const emb = new MessageEmbed()
            .setAuthor({ name: "Unpaused the song, resuming...", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] })
    }

}