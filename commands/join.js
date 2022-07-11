const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

// well, we need to join a voice channel soooo kinda need diss
const { joinVoiceChannel } = require('@discordjs/voice');

const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('🎵 Join me to your VC'),

    async execute(client, interaction, cache) {
        console.log("Ran " + interaction.commandName + " command");

        /*
            Add checks, eg: if there isn't a voice channel
        */

        const guild = client.guilds.fetch(interaction.member.guild.id).then(guild => {
            const channel = guild.channels.fetch(interaction.member.voice.channel.id).then(channel => {
                const connection = joinVoiceChannel({
                    guildId: guild.id,
                    channelId: channel.id,
                    adapterCreator: guild.voiceAdapterCreator
                })

                interaction.reply("Joined your voice channel hehe");

                // setting the connection to the serverqueue object so we can access it later
                let serverQueue = cache.get(interaction.guild.id);
                if( !serverQueue ) console.log("Ran " + interaction.commandName + " but could not find a queue")
                serverQueue.connection = connection;
                cache.set(serverQueue, interaction.guild.id);
            })
        })

    }

}