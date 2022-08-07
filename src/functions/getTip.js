const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {
    async getTip(client, interaction, cache) {
        var tips = [
            "🎶 **Tip:** Use </autoplay:1005678530065076265> to turn autoplay on/off",
            "🎶 **Tip:** Use </loop:1005679301556961280> to loop the current song!",
            "🎶 **Tip:** Stuck? Use </help:1005679522059915264>",
            "🎶 **Tip:** Shuffle the song queue with </shuffle:1005679778948448377>",
            "🎶 **Tip:** Use </skip:1005680012478922752> to skip the to the next song!"
        ];

        var tip = tips[Math.floor(Math.random() * tips.length)];

        console.log("Tip is " + tip);

        return tip;
    }

}