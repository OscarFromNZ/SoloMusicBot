const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    async getConnection(client, interaction, cache) {
        let connection = getVoiceConnection(interaction.guild.id);
        console.log(connection);
        return connection;
    }
    
}