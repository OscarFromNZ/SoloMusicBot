
const {
    MessageEmbed, Message,
} = require('discord.js');

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		console.log(`Added to ${guild.name}`);

		const logs = await guild.client.channels.cache.get("1007177238959116318");
		await logs.send("Added to " + guild.name);

		const channel = guild.systemChannel;

		const emb = new MessageEmbed()
			.setTitle("<:solo:991232706274926683> Solo, the top music bot for Discord!")
			.setDescription("Thank you for adding me to your server! I am an advanced music bot where you can listen to music bot multiple streaming platforms **without ads**, **with friends**, on Discord.\n\nTo give me whirl, you can run the following commands!\nㅤ</join:1005312384442839071> - Join me to your current voice channel!\nㅤ</play:1005312686084608040> - Play a song into your voice channel!\n\nIf you ever need help with the bot, you can run the following commands!\nㅤ</help:1005313529475256413> - Join me to your current voice channel!\nㅤ</support:1005314475689254932> - Get a link to our Discord support server!")
			.setImage("https://i.imgur.com/atEz3Js.gif")

		channel.send( { embeds: [emb] } );
		
	},
};