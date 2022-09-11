import 'dotenv/config';

import process from 'node:process';
import { URL } from 'url';

import sqlite3     from 'sqlite3';
import * as sqlite from 'sqlite';

import { GatewayIntentBits }                        from 'discord.js';
import { EClient, ECommandHandler, SQLiteProvider } from './lib/index.js';

// Make this independent of cwd
import { BotConfig }                                from './config.js';
import * as modules                                 from './modules/index.js';
import { registerEvents }                           from './events/event.js';

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
				ownerIDs: process.env.BOT_OWNER?.split?.(',') ?? BotConfig.OWNERS,
				config:   { TOKEN: '', ...BotConfig }
			},
			{
				disableMentions: 'everyone',
				intents:         [
					GatewayIntentBits.Guilds,
					GatewayIntentBits.GuildMembers,
					GatewayIntentBits.GuildBans,
					GatewayIntentBits.MessageContent,
					// Intents.FLAGS.GUILD_INTEGRATIONS,
					// Intents.FLAGS.GUILD_WEBHOOKS,
					// Intents.FLAGS.GUILD_INVITES,
					// Intents.FLAGS.GUILD_VOICE_STATES,
					// Intents.FLAGS.GUILD_PRESENCES,
					GatewayIntentBits.GuildMessages,
					GatewayIntentBits.GuildMessageReactions,
					// Intents.FLAGS.GUILD_MESSAGE_TYPING,
					GatewayIntentBits.DirectMessages,
					GatewayIntentBits.DirectMessageReactions,
					// Intents.FLAGS.DIRECT_MESSAGE_TYPING
				]
			}
		);

		this.commandHandler = new ECommandHandler(this, {
			prefix: process.env.BOT_PREFIX || BotConfig.PREFIX || ';',
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

await client.login(process.env.BOT_TOKEN || BotConfig.TOKEN).catch(err => {
	console.error('Failed to log in', err);
	process.exit(1);
});

// Just in case, I guess
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
