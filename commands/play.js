const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const play = require('play-dl');

const urlAPI = require('../src/isValidURL');
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
        let url;

        if (urlAPI.isValidURL(input) == true) {
            console.log("Input given was a YT link");

            // getting song URL
            url = interaction.options.getString('song');

            // getting song info
            let songInfo = await play.video_info(interaction.options.getString('song'));
            /*
            const song = {
                title: songInfo.video_details.title,
                url: interaction.options.getString('song'),
                info: songInfo,
            };
            */

            console.log("URL is " + url);

        } else {
            console.log("Input is not a YT link");

            // getting song info AND url
            let search = interaction.options.getString('input');
            let yt_info = await play.search(search, { limit: 1 });
            let songInfo = await play.video_info(yt_info[0].url);

            url = yt_info[0].url;
            console.log("URL is " + url);

        }

    }

}