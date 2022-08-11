const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('⭐ Stuck? Run this command :)'),

    async execute(client, interaction, cache) {
        const emb = new MessageEmbed()
        .setTitle("<:solo:991232706274926683> Solo, the top music bot for Discord!")
        .setDescription("I am an advanced music bot where you can listen to music bot multiple streaming platforms **without ads**, **with friends**, on Discord.\n\nTo give me whirl, you can run the following commands!\nㅤ</join:1005312384442839071> - Join me to your current voice channel!\nㅤ</play:1005312686084608040> - Play a song into your voice channel!\n\nIf you ever need help with the bot, you can run the following commands!\nㅤ</help:1005313529475256413> - Join me to your current voice channel!\nㅤ</support:1005314475689254932> - Get a link to our Discord support server!")
        .setImage("https://i.imgur.com/atEz3Js.gif")

    await interaction.editReply( { embeds: [emb] } );

    }

}