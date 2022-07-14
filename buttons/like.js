module.exports = {
    async execute(client, interaction, cache) {
        interaction.reply( { content: "🛠️ Sorry, this command is currently under maintenance", ephemeral: true } );
    }
}