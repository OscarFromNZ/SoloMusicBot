const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('🎵 Make me loop the current song'),

    async execute(client, interaction, cache) {
        console.log("Ran " + interaction.commandName + " command");
        const serverQueue = cache.get(interaction.guild.id);

        if (!interaction.member.voice.channel) {
            let emb = new MessageEmbed()
                .setAuthor({ name: "You need to be in a voice channel to run this command", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] })
            return;
        }

        // Toggling loop bool
        serverQueue.loop = serverQueue.loop ? false : true;
        cache.set(interaction.guild.id, serverQueue);

        const emb = new MessageEmbed()
            .setAuthor({ name: "I have successfully toggled loop to " + serverQueue.loop, iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] })
    }

}