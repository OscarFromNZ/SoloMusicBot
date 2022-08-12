const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');

module.exports = {
    async execute(client, interaction, cache, audio) {

        if (!interaction.guild.me.voice.channel) {

            console.log("Getting connection");
            const emb = new MessageEmbed()
                .setAuthor({ name: "I am not in a voice channel :(", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn'})
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] });
            return;
        }
        
        if (!interaction.member.voice.channel) {
            let emb = new MessageEmbed()
                .setAuthor({ name: "You need to be in a voice channel to run this command", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
                .setColor(vars.dangerColour)
            await interaction.reply({ embeds: [emb] })
            return;
        }

        var serverQueue = cache.get(interaction.guild.id);
        if (!serverQueue) interaction.reply({
            embed: new MessageEmbed()
                .setAuthor({ name: "An error occured, click this text to contact support", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
                .setColor(vars.dangerColour)
        });

        var connection = serverQueue.connection;

        var player = audio.get(interaction.guild.id);

        try {
            player.stop();
            connection.destroy();
        } catch (e) {
            console.log(e);
        }

        // Resetting the server queue
        serverQueue = {
            vc: undefined,
            connection: undefined,
            songs: [],
            loop: false,
        }

        cache.set(interaction.guild.id, serverQueue);


        const emb = new MessageEmbed()
            .setAuthor({ name: "Successfully disconnected and cleared the queue", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] });
    }
}