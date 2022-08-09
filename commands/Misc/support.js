const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Get a link to our support server'),

    async execute(client, interaction, cache) {
        interaction.editReply("hewwo this cmd isn't a thing yet, going to make this once bot is done/released :)");
    }

}