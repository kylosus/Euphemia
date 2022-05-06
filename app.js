import 'dotenv/config';

import process from 'node:process';
import { URL } from 'url';

import sqlite3     from 'sqlite3';
import * as sqlite from 'sqlite';

import { Intents }                                  from 'discord.js';
import { EClient, ECommandHandler, SQLiteProvider } from './lib/index.js';

// Make this independent of cwd
import config             from './config.json' assert { type: 'json' };
import * as modules       from './modules/index.js';
import { registerEvents } from './events/event.js';

if (process.getuid?.() === 0) {
	console.warn('===================================');
	console.warn('===================================');
	console.warn('====DO NOT RUN THE BOT AS ROOT====');
	console.warn('===================================');
	console.warn('===================================');
}

class Client extends EClient {
	constructor() {
		super(
			{
				ownerIDs:     process.env.BOT_OWNER?.split?.(',') ?? config.owners,
				defaultColor: config.defaultColor ?? [233, 91, 169]
			},
			{
				disableMentions: 'everyone',
				intents: [
					Intents.FLAGS.GUILDS,
					Intents.FLAGS.GUILD_MEMBERS,
					Intents.FLAGS.GUILD_BANS,
					Intents.FLAGS.GUILD_BANS,
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
		);

		this.commandHandler = new ECommandHandler(this, {
			prefix: process.env.BOT_PREFIX || config.prefix || ';',
			path:   new URL('commands', import.meta.url).pathname
		});
	}
}

const client = new Client();

// Load default path commands
await client.commandHandler.loadModules();

// Init DB
const db = await sqlite.open({
	filename: new URL('settings.sqlite3', import.meta.url).pathname,
	driver:   sqlite3.Database
});

// Load modules
await modules.init(client, db);

// Set provider
await client.setProvider(new SQLiteProvider(db));

console.log(`Loaded ${client.commandHandler.commands.size} commands`);

// Register EventEmitter events
await registerEvents(client);

await client.login(process.env.BOT_TOKEN || config.token).catch(err => {
	console.error('Failed to log in', err);
	process.exit(1);
});
