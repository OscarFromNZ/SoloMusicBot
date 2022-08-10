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

const vars = require('./variables.json');

const { getVoiceConnections } = require('@discordjs/voice');

const dotenv = require('dotenv');
// import config IDs
dotenv.config()
const TOKEN = process.env.TOKEN

/*
    HTTP
*/
const http = require("http");
const port = 8080;

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("<html><head></head><body><p>test</p></body></html>");
};

const server = http.createServer(requestListener);
server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
//

const startup = require('./src/startup');
// run this script upon starting up the bot and pass in the client
startup(client)

var cache = new Map();
const audio = new Map();

client.on('interactionCreate', async (interaction) => {
    // if the interaction is a command
    if (interaction.isCommand()) {

        const command = client.commands.get(interaction.commandName);
        const commandName = interaction.commandName;

        if (!command) return;
        console.log(command);

        // checking if the cmd given is a music command 🎵
        if (commandName == 'join' || commandName == 'leave' || commandName == 'play' || commandName == 'skip' || commandName == 'loop' || commandName == 'queue' || commandName == 'nowplaying' || commandName == 'shuffle' || commandName == 'pause' || commandName == 'unpause' || commandName == 'lyrics') {
            // checking if a queue exists, if it doesn't, we make a queue
            let serverQueue = cache.get(interaction.guild.id);
            if (!serverQueue) {
                let queue = {
                    vc: undefined,
                    connection: undefined,
                    songs: [],
                    loop: false,
                    autoplay: false
                }
                cache.set(interaction.guild.id, queue);
            }

            if (!interaction.member.voice.channel) {
                let emb = new MessageEmbed()
                    .setAuthor({ name: "You need to be in a voice channel to run this command", iconURL: interaction.member.user.avatarURL(), url: 'https://discord.gg/Rkq2f3b8Tn' })
                    .setColor(vars.dangerColour)
                await interaction.reply({ embeds: [emb] })
                return;
            }
        }

        try {
            await interaction.deferReply();
            return await command.execute(client, interaction, cache, audio);

        } catch (err) {
            if (err) console.log(err);
        }

    } else if (interaction.isButton()) {

        console.log("Interaction ran was a button");

        const buttonID = await interaction.component.customId;
        console.log(buttonID);

        const file = await require(`./buttons/${buttonID}`);
        console.log("File is " + file);
        await file.execute(client, interaction, cache, audio);

    } else if (interaction.isAutocomplete()) {
        let serverQueue = cache.get(interaction.guild.id);
        let songs = serverQueue.songs;

        const choices = [];
        for (let i = 0; i < songs.length; i++) {
            console.log("Song is " + songs[i]);
            choices.push(songs[i].video_details.title);
        }

        console.log("Choices are " + choices);

        const focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    }

});

/*
    Owner commands :)
    I know they're really badly made but eh... only person seeing em is me, right?
*/

client.on("messageCreate", async(message) => {
    if (!message.author.id === '422603238936936450') return;

    if (message.content == '-guilds') {
        message.channel.send("\`\`\`" + client.guilds.cache.size.toString() + "\`\`\`");
    }

    if (message.content == '-players') {
        let connectionsMap = getVoiceConnections();
        console.log(connectionsMap.size);
        message.channel.send("\`\`\`Connections " + connectionsMap.size.toString() + "\nPlayers " + audio.size.toString() + "\`\`\`");
    }

    if (message.content == '-members') {
        const members = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        console.log(members);
        message.channel.send(members.toString());
    }

    if (message.content == 'are you work') {
        message.channel.send("yes.");
    }

    if (message.content == '-say') {
        await message.delete();
        await message.channel.send(message.content);
    }

});

client.login(TOKEN);