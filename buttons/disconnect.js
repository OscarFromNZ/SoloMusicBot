module.exports = {
    async execute(client, interaction, cache) {
        const emb = new MessageEmbed()
            .setAuthor({ name: "Successfully disconnected and cleared the queue", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] });
    }
}