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
        const guild = client.guilds.fetch(interaction.member.guild.id).then(guild => {
            const channel = guild.channels.fetch(interaction.member.voice.channel.id).then(channel => {
                const connection = joinVoiceChannel({
                    guildId: guild.id,
                    channelId: channel.id,
                    adapterCreator: guild.voiceAdapterCreator
                })

                interaction.reply("Joined your voice channel hehe");
                /* <set connnection to the server queue construct thingy so you can then leave the VC */
            })
        })

    }

}