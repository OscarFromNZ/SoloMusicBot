const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed, Permissions,
} = require('discord.js');

// well, we need to join a voice channel soooo kinda need diss
const { joinVoiceChannel } = require('@discordjs/voice');

const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('🎵 Join me to your VC'),

    async execute(client, interaction, cache) {
        await interaction.deferReply();
        console.log("Ran " + interaction.commandName + " command");
        const permissions = await interaction.member.voice.channel.permissionsFor(client.user.id);

        if (!interaction.member.voice.channel.id) {
            let emb = new MessageEmbed()
                .setAuthor({ name: "You need to be in a voice channel to run this command", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/WtsHhYqXYZ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] })
            return;
        }

        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            const emb = new MessageEmbed()
                .setAuthor({ name: "I do not have permission to join or speak in this channel", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/WtsHhYqXYZ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] })
            return;
        }

        const guild = client.guilds.fetch(interaction.member.guild.id).then(guild => {
            const channel = guild.channels.fetch(interaction.member.voice.channel.id).then(channel => {
                const connection = joinVoiceChannel({
                    guildId: guild.id,
                    channelId: channel.id,
                    adapterCreator: guild.voiceAdapterCreator
                })

                const emb = new MessageEmbed()
                    .setAuthor({ name: "Joined your current voice channel", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/WtsHhYqXYZ' })
                    .setColor(vars.successColour)
                interaction.editReply({ embeds: [emb] })

                // setting the connection to the serverqueue object so we can access it later
                let serverQueue = cache.get(interaction.guild.id);
                if (!serverQueue) console.log("Ran " + interaction.commandName + " but could not find a queue")
                serverQueue.connection = connection;
                cache.set(serverQueue, interaction.guild.id);
            })
        })

    }

}