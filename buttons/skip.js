
const {
    MessageEmbed,
} = require('discord.js');

const playAPI = require('../src/functions/playSong');
const vars = require('../variables.json');

module.exports = {
    async execute(client, interaction, cache, audio) {

        try {
            let serverQueue = cache.get(interaction.guild.id);
            if (!serverQueue) return interaction.reply({
                embed: new MessageEmbed()
                    .setAuthor({ name: "An error occured, click this text to contact support", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
                    .setColor(vars.dangerColour)
            });

            let songs = serverQueue.songs;
    
            if (songs.length < 2) {
                const emb = new MessageEmbed()
                    .setAuthor({ name: "There are not enough songs in the queue to skip!", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
                    .setColor(vars.dangerColour)
    
                await interaction.reply({ embeds: [emb], content: "🎶 **Tip:** Use </play:1005558358604009472> to queue a song!" });
                return;
            }

        } catch (e) {
            console.log(e);
            const logs = await client.channels.cache.get("1007177238959116318");
            await logs.send(e);
        }

        // skip to the next song in the queue and play it
        try {
            serverQueue.songs.shift();
        } catch (e) {
            console.log(e);
        }
        
        cache.set(interaction.guild.id, serverQueue);
        await playAPI.playSong(client, interaction, cache, audio);


    }

}