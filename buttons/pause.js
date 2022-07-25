
const {
    MessageEmbed,
} = require('discord.js');

const vars = require('../variables.json');

module.exports = {
    async execute(client, interaction, cache, audio) {
        if ( !audio ) {
            audio = new Map();
        }

        let player = audio.get(interaction.guild.id);
        player.pause();

        const emb = new MessageEmbed()
            .setAuthor({ name: "Paused the song, to unpause, run /unpause", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
            .setColor(vars.successColour)
            .setFooter({ text: "This command is quite new and buggy, you can always mute me instead! :)"})
        await interaction.reply({ embeds: [emb] });
    }
}