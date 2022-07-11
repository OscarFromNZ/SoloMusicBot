const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const play = require('play-dl');

const urlAPI = require('../src/functions/isValidURL');
const playAPI = require('../src/functions/playSong');
const vars = require('../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 Play a song in the current voice channel!')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('YT link, song name, etc')
                .setRequired(true)),

    async execute(client, interaction, cache) {
        console.log("Ran " + interaction.commandName + " command");
        const permissions = interaction.member.voice.channel.permissionsFor(client.user.id);

        // just some checks
        if (!interaction.member.voice.channel.id) {
            let emb = new MessageEmbed()
                .setAuthor({ name: "You need to be in a voice channel to run this command", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/WtsHhYqXYZ' })
                .setColor(vars.dangerColour)
            await interaction.reply({ embeds: [emb] })
            return;
        }

        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            const emb = new MessageEmbed()
                .setAuthor({ name: "I do not have permission to join or speak in this channel", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/WtsHhYqXYZ' })
                .setColor(vars.dangerColour)
            await interaction.reply({ embeds: [emb] })
            return;
        }

        const serverQueue = cache.get(interaction.guild.id);

        let input = interaction.options.getString('song');
        console.log("Input given is " + input);
        let url;

        if (urlAPI.isValidHttpUrl(input) == true) {
            console.log("Input given was a YT link");

            // getting song URL
            url = interaction.options.getString('song');

            // getting song info
            let songInfo = await play.video_info(url);
            serverQueue.songs.push(songInfo);
            console.log(serverQueue.songs);

            console.log("URL is " + url);
                cache.set(interaction.guuld.id, serverQueue); // Saving data to cache

        } else {
            console.log("Input is not a YT link");

            // getting song info AND url for it
            let yt_info = await play.search(input, { limit: 1 });

            url = yt_info[0].url;

            // getting song info
            let songInfo = await play.video_info(url);
            serverQueue.songs.push(songInfo);
            console.log(serverQueue.songs);

            console.log("URL is " + url);
                cache.set(interaction.guuld.id, serverQueue); // Saving data to cache
        }

    }

}