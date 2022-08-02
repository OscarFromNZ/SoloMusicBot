
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../../variables.json');

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
            try {
                serverQueue.autoplay = true;
            } catch(e) {
                console.log(e);
            }

            const emb = new MessageEmbed()
                .setAuthor({ name: "I have turned autoplay on for this session", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.successColour)
            await interaction.reply({ embeds: [emb] });
        }

        if (interaction.options.getSubcommand() === 'off') {
            try {
                serverQueue.autoplay = false;
            } catch(e) {
                console.log(e);
            }

            const emb = new MessageEmbed()
                .setAuthor({ name: "I have turned autoplay off for this session", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.successColour)
            await interaction.reply({ embeds: [emb] });
        }

    }

}