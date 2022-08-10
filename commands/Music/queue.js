/*
    FILE INFORMATION
    All this file does is get the URL of the song, put it into an array and then send it over to playSong.js
    playSong.js is where all the magic happens
*/

const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed, CommandInteractionOptionResolver,
} = require('discord.js');

const vars = require('../../variables.json');
const songsAPI = require('../../src/functions/getSongs');
const playAPI = require('../../src/functions/playSong');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('🎵 Manage/view the current song queue!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('🎵 View the current song queue!'))

        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("🎵 Remove a song from the current song queue!")
                .addStringOption((option) =>
                    option
                        .setName('song')
                        .setDescription('The song to remove from the queue')
                        .setRequired(true)
                        .setAutocomplete(true))
        ),


    async execute(client, interaction, cache, audio) {
        console.log("\x1b[36m%s\x1b[0m", "Ran " + interaction.commandName + " command");

        if (interaction.options.getSubcommand() === 'view') {
            const serverQueue = cache.get(interaction.guild.id);
            const songs = serverQueue.songs;
            console.log(songs);

            if (songs.length === 0) {
                let emb3 = new MessageEmbed()
                    .setAuthor({ name: "There are no songs in the queue!", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
                    .setColor(vars.dangerColour)
                await interaction.editReply({ embeds: [emb3] });
                return;
            }

            let emb2 = new MessageEmbed()
                .setAuthor({ name: "Here is the current server queue for " + interaction.guild.name, iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
                .setColor(vars.successColour)

            let description = "";

            for (let i = 0; i < songs.length; i++) {
                description = description + `\`${i}.\` **${songs[i].video_details.title}**\n`;
            }
            console.log(description);

            const emb = new MessageEmbed()
                .setColor('2f3136')
                .setDescription(description)

            await interaction.editReply({ embeds: [emb2, emb] });

        }
        if (interaction.options.getSubcommand() === 'remove') {
            const emb = new MessageEmbed()
            .setColor(vars.successColour);

            const serverQueue = cache.get(interaction.guild.id);
            const songs = serverQueue.songs;
            const song = interaction.options.getString("song");

            emb.setAuthor({ name: "I have removed " + song + " from the queue", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
            await interaction.editReply({ embeds: [emb] });

            for (let i = 0; i < songs.length; i++) {
                if (songs[i].video_details.title === song) {
                    songs.splice(i, 1);
                    if (i === 0) {
                        await playAPI.playSong(client, interaction, cache, audio);
                    }
                    serverQueue.songs = songs;
                    cache.set(interaction.guild.id, serverQueue);
                }
            }

        }
    }

}