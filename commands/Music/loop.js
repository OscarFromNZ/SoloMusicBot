const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('🎵 Make me loop the current song'),

    async execute(client, interaction, cache) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");
        const serverQueue = cache.get(interaction.guild.id);

        // Toggling loop bool
        serverQueue.loop = serverQueue.loop ? false : true;
        cache.set(interaction.guild.id, serverQueue);

        const emb = new MessageEmbed()
            .setAuthor({ name: "I have successfully toggled loop to " + serverQueue.loop, iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
            .setColor(vars.successColour)
        await interaction.editReply({ embeds: [emb] })
    }

}