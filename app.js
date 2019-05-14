require('dotenv').config();

const Commando		= require('discord.js-commando');
const config		= require('./config.json');
const MongoClient	= require('mongodb').MongoClient;
const path			= require('path');
const sqlite		= require('sqlite');

const client = new Commando.Client({
	owner: process.env.BOT_OWNER || config.owner,
	commandPrefix: process.env.BOT_PREFIX || config.prefix || ';',
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents : [
		'GUILD_SYNC',
		'GUILD_DELETE',
		'CHANNEL_CREATE',
		'CHANNEL_DELETE',
		'CHANNEL_UPDATE',
		'CHANNEL_PINS_UPDATE',
		'MESSAGE_DELETE_BULK',
		'USER_NOTE_UPDATE',
		'USER_SETTINGS_UPDATE',
		'PRESENCE_UPDATE',
		'VOICE_STATE_UPDATE',
		'TYPING_START'
	]
});

//TODO: learn how Mongo works ffs
MongoClient.connect(process.env.DATABASE_URL, { useNewUrlParser: true }).then(db => {
	client.db = db;
	client.database = db.db(process.env.DATABASE_NAME);
}).catch(error => {
	throw `Failed connecting to database:\n${error}`;
});

require('./events/event.js')(client);
global.BOT_DEFAULT_COLOR = config.defaultColor || [233, 91, 169];

client.setProvider(
	sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => {
		return new Commando.SQLiteProvider(db);
	})
);

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['anime', 'Anime and Manga commands'],
		['bot', 'Public bot commands'],
		['fun', 'Fun commands'],
		['moderation', 'Moderation commands'],
		['owner', 'Owner only commands'],
		['setup', 'Server utility setup commands'],
		['subscription', 'Tag subscription commands'],
		['utility', 'Utility commands']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		ping: false,
		help: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.messageStats = { received: 0, sent: 0, commands: 0 };	// Possible data race, but it's good enough

client.login(process.env.BOT_TOKEN || config.token).catch(error => {
	throw `Failed logging in\n${error.message}`;
});
