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
        console.log("Ran " + interaction.commandName + " command");

        if (!audio) return interaction.reply("An error occurred, try again");

        
        try {
            
            var player = audio.get(interaction.guild.id);
            console.log("before pause", player);
            player.pause();
            console.log("after pause", player);
        } catch (err) {
            console.log(err)
        }

        const emb = new MessageEmbed()
            .setAuthor({ name: "Paused the song, to unpause, run /unpause", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] });
    }

}