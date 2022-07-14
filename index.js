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

client.on('interactionCreate', async (interaction) => {
    // if the interaction is not a command, eg: it's a button, return
    if (!interaction.isCommand) return;

    const command = client.commands.get(interaction.commandName);
    const commandName = interaction.commandName;

    if (!command) return;

    // checking if the cmd given is a music command 🎵
    if (commandName == 'join' || commandName == 'leave' || commandName == 'play') {
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
        return await command.execute(client, interaction, cache);

    } catch (err) {
        if (err) console.log(err);
    }

});

client.login(TOKEN);