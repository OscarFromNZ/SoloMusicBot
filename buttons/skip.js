
const {
    MessageEmbed,
} = require('discord.js');

const playAPI = require('../src/functions/playSong');
const vars = require('../variables.json');

module.exports = {
    async execute(client, interaction, cache, audio) {

        let serverQueue = cache.get(interaction.guild.id);
        let songs = serverQueue.songs;

        if (songs.length < 2) {
            const emb = new MessageEmbed()
                .setAuthor({ name: "There are not enough songs in the queue!", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/GyGCYu5ukJ' })
                .setColor(vars.dangerColour)

            await interaction.reply({ embeds: [emb], content: "🎶 **Tip:** Use </play:1005558358604009472> to queue another song!" });
            return;
        }

        // skip to the next song in the queue and play it
        serverQueue.songs.shift();
        cache.set(interaction.guild.id, serverQueue);
        await playAPI.playSong(client, interaction, cache, audio);

        
    }

}