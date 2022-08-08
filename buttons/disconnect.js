const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');

module.exports = {
    async execute(client, interaction, cache, audio) {
        if (!interaction.member.voice.channel) {
            let emb = new MessageEmbed()
                .setAuthor({ name: "You need to be in a voice channel to run this command", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.reply({ embeds: [emb] })
            return;
        }
        
        var serverQueue = cache.get(interaction.guild.id);
        var connection = serverQueue.connection;

        var player = audio.get(interaction.guild.id);

        player.stop();
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
            .setAuthor({ name: "Successfully disconnected and cleared the queue", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] });
    }
}