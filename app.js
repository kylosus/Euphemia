require('dotenv').config();

const path    = require('path');
const sqlite3 = require('sqlite3').verbose();
const sqlite  = require('sqlite');

const { Intents }                                  = require('discord.js');
const { EClient, ECommandHandler, SQLiteProvider } = require('./lib');

const config  = require('./config.json');
const modules = require('./modules');

class Client extends EClient {
	constructor() {
		super(
			{
				ownerIDs:     process.env.BOT_OWNER ? process.env.BOT_OWNER.split(',') : config.owners,
				defaultColor: config.defaultColor || [233, 91, 169]
			},
			{
				disableMentions: 'all',
				// untested, might break
				partials: [
					'MESSAGE',
					'GUILD_MEMBER',
					'MESSAGE'
				],
				ws:       {
					intents: [
						Intents.FLAGS.GUILDS,
						Intents.FLAGS.GUILD_MEMBERS,
						Intents.FLAGS.GUILD_BANS,
						Intents.FLAGS.GUILD_BANS,
						Intents.FLAGS.GUILD_EMOJIS,
						// Intents.FLAGS.GUILD_INTEGRATIONS,
						// Intents.FLAGS.GUILD_WEBHOOKS,
						// Intents.FLAGS.GUILD_INVITES,
						// Intents.FLAGS.GUILD_VOICE_STATES,
						// Intents.FLAGS.GUILD_PRESENCES,
						Intents.FLAGS.GUILD_MESSAGES,
						Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
						// Intents.FLAGS.GUILD_MESSAGE_TYPING,
						Intents.FLAGS.DIRECT_MESSAGES,
						Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
						// Intents.FLAGS.DIRECT_MESSAGE_TYPING
					]
				}
			}
		);

		// Race condition?
		this.setProvider(
			sqlite.open({
				filename: path.join(__dirname, 'settings.sqlite3'),
				driver:   sqlite3.Database
			}).then(async db => {
				await modules.init(this, db);
				return new SQLiteProvider(db);
			})
		).catch(console.error);

		this.commandHandler = new ECommandHandler(this, {
			prefix: process.env.BOT_PREFIX || config.prefix || ';',
			path:   path.join(__dirname, 'commands'),
		});
	}
}

const client = new Client();
require('./events/event.js')(client);

client.login(process.env.BOT_TOKEN || config.token).catch(console.error);
