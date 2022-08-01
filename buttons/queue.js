
const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');

module.exports = {
    async execute(client, interaction, cache, audio) {

        const serverQueue = cache.get(interaction.guild.id);
        const songs = serverQueue.songs;

        if (!songs) {

            const emb = new MessageEmbed()
                .setAuthor({ name: "There are no songs in the current queue", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)
            await interaction.reply({ embeds: [emb] });

            return;
        }

        let description = "";

        for (let i = 0; i < songs.length; i++) {
            description = description + `\`${i}.\` **${songs[i].video_details.title}**\n`;
        }
        console.log(description);

        const emb = new MessageEmbed()
            .setColor('2f3136')
            .setDescription(description)

        await interaction.reply({ embeds: [emb], ephemeral: true });

    }
}