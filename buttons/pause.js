
const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');

module.exports = {
    async execute(client, interaction, cache, audio) {
        if ( !audio ) {
            console.log("Audio is not defined.!");
            audio = new Map();
        }

        try {
            var player = audio.get(interaction.guild.id);
            player.pause();
        } catch (err) {
            console.log(err)
        }

        const emb = new MessageEmbed()
            .setAuthor({ name: "Paused the song, to unpause, run /unpause", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
            .setColor(vars.successColour)
        await interaction.reply({ embeds: [emb] });
    }
}