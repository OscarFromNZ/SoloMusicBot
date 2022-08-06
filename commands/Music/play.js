/*
    FILE INFORMATION
    All this file does is get the URL of the song, put it into an array and then send it over to playSong.js
    playSong.js is where all the magic happens
*/

const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const { joinVoiceChannel } = require('@discordjs/voice');

const play = require('play-dl');

const urlAPI = require('../../src/functions/isValidURL');
const playAPI = require('../../src/functions/playSong');
const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 Play a song in the current voice channel!')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('YT link, song name, etc')
                .setRequired(true)),

    async execute(client, interaction, cache, audio) {
        await interaction.deferReply();
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");

        const permissions = interaction.member.voice.channel.permissionsFor(client.user.id);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            const emb = new MessageEmbed()
                .setAuthor({ name: "I do not have permission to join or speak in this channel", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] })
            return;
        }

        const serverQueue = cache.get(interaction.guild.id);

        if (!serverQueue.connection) {
            let emb = new MessageEmbed()
                .setAuthor({ name: "Please run the /join command first", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.editReply({ embeds: [emb] })
            return;
        }

        let input = interaction.options.getString('song');
        console.log("Input given is " + input);

        let url;

        if (urlAPI.isValidHttpUrl(input) == true) {
            console.log("Input given was a YT link");

            // getting song URL
            url = interaction.options.getString('song');

            console.log("URL is " + url);
            cache.set(interaction.guild.id, serverQueue); // Saving data to cache

        } else {
            console.log("Input is not a YT link");

            // getting song info AND url for it
            let yt_info = await play.search(input, { limit: 1 });

            url = yt_info[0].url;

            console.log("URL is " + url);
            cache.set(interaction.guild.id, serverQueue); // Saving data to cache

        }

        // getting song info
        let songInfo = await play.video_info(url);

        let songs = serverQueue.songs;

        if (songs.length === 0) {
            console.log("No songs in queue");

            serverQueue.songs.push(songInfo);

            await playAPI.playSong(client, interaction, cache, audio); // Calling the function to actually play the song

        } else {
            console.log("Is songs in the queue!");
            const emb = new MessageEmbed()
                .setAuthor({ name: "Added: \"" + songInfo.video_details.title + "\" to the queue", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor("#03fc6b")

            await interaction.editReply({ embeds: [emb] });
            serverQueue.songs.push(songInfo);
        }

        cache.set(interaction.guild.id, serverQueue);

    }

}