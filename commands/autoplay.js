
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('🎵 Manage the autoplay settings for the guild!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('on')
                .setDescription('🎵 Toggle autoplay to on'))

        .addSubcommand(subcommand =>
            subcommand
                .setName("off")
                .setDescription("🎵 Toggle autoplay to off")
        ),


    async execute(client, interaction, cache, audio) {
        console.log("Ran " + interaction.commandName + " command");
        var serverQueue = cache.get(interaction.guild.id);

        if (interaction.options.getSubcommand() === 'on') {

        }

        if (interaction.options.getSubcommand() === 'off') {

        }

    }

}