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
        let tips = [
            "🎶 **Tip:** Use </autoplay:1005678530065076265> to turn **autoplay** on/off",
            "🎶 **Tip:** Use </loop:1005679301556961280> to loop the current song!",
            "🎶 **Tip:** Stuck? Use </help:1005679522059915264> if you require it!",
            "🎶 **Tip:** Shuffle the song queue with </shuffle:1005679778948448377>",
            "🎶 **Tip:** Use </skip:1005680012478922752> to skip the to the next song!",
        ]

        let randomNo = Math.floor(Math.random() * (tips.lengths - 1 + 1) + 1);
        let tip = tips[randomNo];

        console.log(tip);

        return tip;
    }

}