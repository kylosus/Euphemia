require('dotenv').config();

const EClient = require('./lib/EClient');
const ECommandHandler = require('./lib/ECommandHandler');

const Commando = require('discord.js-commando');
const config = require('./config.json');
const path = require('path');
// const sqlite		= require('sqlite');

// const client = new Commando.Client({
// 	owner: process.env.BOT_OWNER || config.owner,
// 	commandPrefix: process.env.BOT_PREFIX || config.prefix || ';',
// 	disableEveryone: true,
// 	unknownCommandResponse: false,
// 	disabledEvents: [
// 		'GUILD_SYNC',
// 		'GUILD_DELETE',
// 		'CHANNEL_CREATE',
// 		'CHANNEL_DELETE',
// 		'CHANNEL_UPDATE',
// 		'CHANNEL_PINS_UPDATE',
// 		'MESSAGE_DELETE_BULK',
// 		'USER_NOTE_UPDATE',
// 		'USER_SETTINGS_UPDATE',
// 		'PRESENCE_UPDATE',
// 		'VOICE_STATE_UPDATE',
// 		'TYPING_START'
// 	]
// });

/*

const ArgumentType = require('./lib/Argument/ArgumentType');
// const RegexParser = require('./lib/Argument/RegexParser');
const ArgumentParser = require('./lib/Argument/ArgumentParser');
const ArgConstants = require('./lib/Argument/ArgumentTypeConstants');


// const parser = new RegexParser([/(?<=<@)(\d+)(?=>)/g, /\d/]);
// const parser = new RegexParser([/<@\d+>/g, /\d+/g, /aduh121231/g]);
const argParser = new ArgumentParser([
	{
		label: 'test1',
		// type: new ArgumentType(/<@\d+>/g),
		type: ArgConstants.MEMBERS,
		message: 'test1 message'
	},
	{
		label: 'test2',
		type: new ArgumentType(/\d+/g),
		message: 'test2 message'
	}
]);

try {
	const parsed = argParser.parse('<@22222> asdiajsd <@1231> 5');
	console.log(parsed);
} catch (err) {
	console.log(`Error parsing: ${err}`);
}


// const a = parser.parse('<@22222> asdiajsd <@1231> 5');
// console.log(a);
return;

 */


const { join } = require('path');

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const SQLiteProvider = require('./lib/Provider/SQLiteProvider');

// const commandsPath = join(__dirname, '..', 'commands/');
// const listenersPath = join(__dirname, '..', 'listeners/');

class Client extends EClient {
	constructor() {
		super(
			{
				ownerID: '275331662865367040'
			},
			{
				disableEveryone: true
			}
		);

		// Race condition?
		this.setProvider(
			sqlite.open({
				filename: path.join(__dirname, 'settings.sqlite3'),
				driver: sqlite3.Database
			}).then(db => {
				return new SQLiteProvider(db);
			})
		);

		this.commandHandler = new ECommandHandler(this, {
			prefix: ';',
			path: join(__dirname, 'commands'),
			// argumentDefaults: {
			// 	otherwise: 'test',
			// 	// prompt: {
			// 	// 	start: 'hi',
			// 	// 	timeout: 'Time ran out, command has been cancelled.',
			// 	// 	ended: 'Too many retries, command has been cancelled.',
			// 	// 	cancel: 'Command has been cancelled.',
			// 	// 	retries: 0,
			// 	// 	time: 0
			// 	// }
			// }
		});
	}
}

const client = new Client();
// eslint-disable-next-line no-unused-vars
client.login(process.env.BOT_TOKEN).then(_ => console.log('Logged in'));

// console.log(client);

//
// client2.login(process.env.BOT_TOKEN);
//
// require('./events/event.js')(client);
// global.BOT_DEFAULT_COLOR = config.defaultColor || [233, 91, 169];
//
// client.setProvider(
// 	sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => {
// 		return new Commando.SQLiteProvider(db);
// 	})
// ).catch(console.error);
//
// client.registry
// 	.registerDefaultTypes()
// 	.registerGroups([
// 		['anime', 'Anime and Manga commands'],
// 		['bot', 'Public bot commands'],
// 		['fun', 'Fun commands'],
// 		['moderation', 'Moderation commands'],
// 		['owner', 'Owner only commands'],
// 		['setup', 'Server utility setup commands'],
// 		['subscription', 'Tag subscription commands'],
// 		['utility', 'Utility commands']
// 	])
// 	.registerDefaultGroups()
// 	.registerDefaultCommands({
// 		ping: false,
// 		help: false
// 	})
// 	.registerCommandsIn(path.join(__dirname, 'commands'));
//
// client.messageStats = { received: 0, sent: 0, commands: 0 };	// Possible data race, but it's good enough
//
// // client.login(process.env.BOT_TOKEN || config.token).catch(error => {
// // 	throw `Failed logging in\n${error.message}`;
// // });
//
// client.on('commandBlock', (m, reason, data) => {
// 	console.log('a');
// });
//
// client.on('commandError', (command, error, message, args, fromPatter, result) => {
// 	console.log('a');
// });
//
// client.on('commandCancel', (command, reason, message, result) => {
// 	console.log('a');
// });