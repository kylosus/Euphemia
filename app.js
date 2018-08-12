const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const path = require('path');   
const sqlite = require('sqlite');
const config = require('./config.json');
const client = new Commando.Client({
    owner: process.env.BOT_OWNER || config.owner,
    commandPrefix: ';',
    disableEveryone: true,
    unknownCommandResponse: false
});
require('./events/event.js')(client);


client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => {
        // let knex = require('knex')({
        //     dialect: 'sqlite3',
        //     connection: {
        //       filename: 'settings.sqlite3'
        //     },
        //     useNullAsDefault: true
        //   });
        // client.database = db;
        // client.database.handler = knex;
        return new Commando.SQLiteProvider(db)
    })
).catch(console.error);


client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['moderation', 'Moderation commands'],
        ['setup', 'Server utility setup commands'],
        ['utility', 'Utility commands'],
        ['fun', 'Fun commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        ping: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'))


// client.on('message', message => {}); 

client.login(process.env.DISCORD_TOKEN || config.token).catch(fail => {
    console.log('Failed to log in\n' + fail.toString());
});