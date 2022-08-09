const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('🎵 Make me leave my current VC'),

    async execute(client, interaction, cache) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");
        var serverQueue = cache.get(interaction.guild.id);

        if (!interaction.guild.me.voice.channel) {

            const emb = new MessageEmbed()
                .setAuthor({ name: "I am not in a voice channel", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] });
            return;
        }

        const connection = serverQueue.connection;
        connection.destroy();

        // Resetting the server queue
        serverQueue = {
            vc: undefined,
            connection: undefined,
            songs: [],
            loop: false,
        }

        cache.set(interaction.guild.id, serverQueue);

        const emb = new MessageEmbed()
            .setAuthor({ name: "Disconnected from the voice channel and cleared the queue, run /join to rejoin", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.editReply({ embeds: [emb] });
    }

}