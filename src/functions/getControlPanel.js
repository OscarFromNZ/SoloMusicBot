const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {
    async getPanel(client, interaction, cache, songInfo) {

        const panelRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('like')
                    .setEmoji("❤️")
                    .setStyle('SUCCESS'),

                new MessageButton()
                    .setCustomId('pause')
                    .setEmoji('⏸️')
                    .setStyle('PRIMARY'),

                new MessageButton()
                    .setCustomId('skip')
                    .setEmoji('⏭️')
                    .setStyle('PRIMARY'),
            );

        const panelRow2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('queue')
                    .setLabel('Queue')
                    .setStyle('SECONDARY'),

                new MessageButton()
                    .setCustomId('disconnect')
                    .setLabel('Disconnect')
                    .setStyle('DANGER'),
            );


        const emb = new MessageEmbed()
            .setDescription("<:img12:985020922408869919> <:img12:985020922408869919> <:img12:985020922408869919> <:img12:985020922408869919> <:img12:985020922408869919> <:img2:985020903198953472><:img3:985020904830537738><:img4:985020906676060160><:img5:985020908500570112><:img6:985020910304129134><:img7:985020912300621885><:img8:985020913999286372><:img9:985020915777699850><:img10:985020918097133588>")
            .setColor("2f3136")
            .setImage("https://media.discordapp.net/attachments/813443732367999018/985017368323440650/invis_1.png")
            .addFields(
                { name: '<:playingJamie:985033887937867819> Current Song:', value: "`[" + songInfo.video_details.title + "](" + songInfo.video_details.url + ")`", inline: true },
                { name: '<:membersJamie:985035072577081344> Requested By:', value: "<@" + interaction.user.id + ">", inline: true },
                { name: '<:paletteJamie:985038222084153354> Artist:', value: songInfo.video_details.channel.name, inline: true },
                //{ name: '\u200B', value: '\u200B' },
            );

        let data = [emb, panelRow, panelRow2];

        return data;
    }

}