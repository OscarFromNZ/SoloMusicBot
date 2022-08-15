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

    async execute(client, interaction, cache, audio) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");
        try {
            var serverQueue = cache.get(interaction.guild.id);
            var connection = serverQueue.connection;
            var player = audio.get(interaction.guild.id);

        } catch (e) {
            console.log(e);
        }

        try {
            if (!interaction.guild.me.voice.channel) {
                const emb = new MessageEmbed()
                    .setAuthor({ name: "I am not in a voice channel", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
                    .setColor(vars.dangerColour)
                await interaction.editReply({ embeds: [emb] });
                return;
            }

            if (!interaction.member.voice.channel) {
                const emb = new MessageEmbed()
                    .setAuthor({ name: "You need to be in a voice channel to run this command", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
                    .setColor(vars.dangerColour)
                await interaction.editReply({ embeds: [emb] })
                return;
            }

        } catch (e) {
            console.log(e);
            const logs = await client.channels.cache.get("1007177238959116318");
            await logs.send(e);
        }

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
            .setAuthor({ name: "Disconnected from the voice channel and cleared the queue, run /join to rejoin", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
            .setColor(vars.successColour)
        await interaction.editReply({ embeds: [emb] });
    }

}