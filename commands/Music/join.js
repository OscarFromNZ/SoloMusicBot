const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed, Permissions,
} = require('discord.js');

// well, we need to join a voice channel soooo kinda need diss
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('🎵 Join me to your VC'),

    async execute(client, interaction, cache) {

        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");

        console.log("Beginnng checks");
        const permissions = await interaction.member.voice.channel.permissionsFor(client.user.id);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            const emb = new MessageEmbed()
                .setAuthor({ name: "I do not have permission to join or speak in this channel", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] });
            return;
        }

        console.log("Passed permissions check");
        if (interaction.guild.me.voice.channel) {

            console.log("Getting connection");
            let connection = getVoiceConnection();
            console.log("Got connection");
            if (typeof connection == 'undefined') return interaction.editReply({ content: "An error occurred, get a mod to disconnect me manually and then run join again \n (I have no idea how you managed to get this error lol)"});
            console.log("Connection is not undefined");

            const emb = new MessageEmbed()
                .setAuthor({ name: "I am already in a voice channel :(", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] });
            return;
        }
        console.log("Passed VC check");
        console.log("Passed checks");

        const guild = client.guilds.fetch(interaction.member.guild.id).then(guild => {
            const channel = guild.channels.fetch(interaction.member.voice.channel.id).then(channel => {
                console.log("🌳 Joining VC");
                const connection = joinVoiceChannel({
                    guildId: guild.id,
                    channelId: channel.id,
                    adapterCreator: guild.voiceAdapterCreator
                })
                console.log("🌳 Joined VC");

                const emb = new MessageEmbed()
                    .setAuthor({ name: "Joined your current voice channel", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                    .setColor(vars.successColour)
                interaction.editReply({ embeds: [emb], content: "🎶 **Tip:** Use </play:1005558358604009472> to queue a song!" })

                // setting the connection to the serverqueue object so we can access it later
                let serverQueue = cache.get(interaction.guild.id);
                serverQueue.connection = connection;
                cache.set(serverQueue, interaction.guild.id);
            })
        })

    }

}