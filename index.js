// import requirements 
const {
    Client,
    Intents,
    MessageEmbed,
} = require('discord.js');

// starting in djs v13, we are required to specify which intents we are using in the client constructor
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

// we require play-dl to get ++ stream music from YouTube
const play = require('play-dl');

const dotenv = require('dotenv');
// import config IDs
dotenv.config()
const TOKEN = process.env.TOKEN

const startup = require('./src/startup');
// run this script upon starting up the bot and pass in the client
startup(client)

var cache = new Map();
var audio = new Map();

client.on('interactionCreate', async (interaction) => {
    if ( !audio ) {
        audio = new Map();
    }
    // if the interaction is a command
    if (interaction.isCommand()) {

        const command = client.commands.get(interaction.commandName);
        const commandName = interaction.commandName;
    
        if (!command) return;
        console.log(command);
    
        // checking if the cmd given is a music command 🎵
        if (commandName == 'join' || commandName == 'leave' || commandName == 'play' || commandName == 'skip' || commandName == 'loop') {
            // checking if a queue exists, if it doesn't, we make a queue
            let serverQueue = cache.get(interaction.guild.id);
            if (!serverQueue) {
                let queue = {
                    vc: undefined,
                    connection: undefined,
                    songs: [],
                    loop: false,
                }
                cache.set(interaction.guild.id, queue);
            }
        }
    
        try {
            return await command.execute(client, interaction, cache, audio);
    
        } catch (err) {
            if (err) console.log(err);
        }

    } else if (interaction.isButton()) {

        console.log("Interaction ran was a button");

        const buttonID = interaction.component.customId;
        console.log(buttonID);

        const file = require(`./buttons/${buttonID}`);
        console.log("File is " + file);
        file.execute(client, interaction, cache, audio);

    } else if (interaction.isAutocomplete()) {
        let serverQueue = cache.get(interaction.guild.id);
        let songs = serverQueue.songs;
        console.log(songs[0].video_details.title);

        const choices = [];
        for (let i = 0; i < songs; i++) {
            console.log(i);
            choices.push(i.video_details.title);
        }

        console.log("Choices are " + choices);

        const focusedValue = interaction.options.getFocused();
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    }

});

client.login(TOKEN);