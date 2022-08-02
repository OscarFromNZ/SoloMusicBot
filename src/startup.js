const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9');

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

const fs = require('fs')
//const fs = require('node:fs');
const path = require('node:path');
const { dirname } = require('path');

module.exports = (client) => {

    // Command handling
    const commands = [];    // Creating a collection for commands in client
    client.commands = new Collection();

    const musicFiles = fs.readdirSync('./commands/Music').filter(file => file.endsWith('.js'));
    for (const file of musicFiles) {
        const command = require(`../commands/Music/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    const miscFiles = fs.readdirSync('./commands/Misc').filter(file => file.endsWith('.js'));
    for (const file of miscFiles) {
        const command = require(`../commands/Misc/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

    // When the client is ready, this only runs once
    client.once('ready', async () => {
        console.log(`${client.user.tag} is now online!`);

        // Registering the commands in the client
        const rest = new REST({
            version: '9'
        }).setToken(TOKEN);
        (async () => {
            try {
                await rest.put(
                    Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                },
                );
                console.log('Successfully registered application commands globally');
            } catch (error) {
                if (error) console.error(error);
            }
        })();

    });

}