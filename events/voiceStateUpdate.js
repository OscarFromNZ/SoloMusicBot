
const {
    MessageEmbed, Message,
} = require('discord.js');

module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState) {
		console.log("Voice status update :)");
        let guildId = newState.guild.id;

        try {

        } catch (e) {
            console.log(e);
        }
		
	},
};