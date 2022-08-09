const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('🎵 Pause the current song'),

    async execute(client, interaction, cache, audio) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");

        if (!audio) return interaction.editReply("An error occurred, try again");

        
        try {
            var player = audio.get(interaction.guild.id);
            player.pause();
        } catch (err) {
            console.log(err)
        }

        const emb = new MessageEmbed()
            .setAuthor({ name: "Paused the song, to unpause, run /unpause", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.editReply({ embeds: [emb] });
    }

}