// I DON'T KNOW WHEN OR IF THE GUILD CACHE IS INVALIDATED
// I AM SAVING SETTINGS DIRECTLY INSIDE THE CACHED GUILD OBJECT
// TO AVOID MAKING A MAP LOOKUP, BUT IF IT IS EVER INVALIDATED
// AND OVERWRITTEN, ALL SETTINGS ARE GONE

// whatever you say, man

import Provider from './Provider.js';

const STATEMENTS = {
	insert: null,
	getGuilds: null
};

const TABLE_NAME = 'settings';

export default class SQLiteProvider extends Provider {
	constructor(db) {
		super();
		this.db = db;

		this.settings = new Map();

		this.init();
	}

	async init() {
		// Performance tuning
		await this.db.run('PRAGMA journal_mode = WAL;');

		await this.db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (guild INTEGER PRIMARY KEY, settings TEXT)`);

		STATEMENTS.insert = await this.db.prepare(`INSERT OR REPLACE INTO ${TABLE_NAME} VALUES(?, ?)`);
		STATEMENTS.getGuilds = await this.db.prepare(`SELECT CAST(guild as TEXT) as guild, settings FROM ${TABLE_NAME}`);
	}

	async loadGuilds(guilds) {
		// This is why
		// https://github.com/TryGhost/node-sqlite3/issues/854
		const rows = await STATEMENTS.getGuilds.all();

		for (const guild of guilds.values()) {
			guild.settings = {};

			// Override guild.provider
			// what the absolute fuck is this?
			guild.provider = {
				get: (...args) => {
					return this.get(guild, ...args);
				},

				set: (...args) => {
					return this.set(guild, ...args);
				}
			};
		}

		for (const row of rows) {
			const guildID = row.guild;

			const settings = (s => {
				try {
					return JSON.parse(s);
				} catch (err) {
					throw `SQLiteProvider couldn't parse the settings stored for guild ${row.guild}.`;
				}
			})(row.settings);

			const cachedGuild = guilds.get(guildID);

			if (!cachedGuild) {
				continue;
			}

			this.settings.set(guildID, settings);
			cachedGuild.settings = settings;
		}
	}

	get(guild, setting, otherwise = null) {
		// const e = this.settings.get(guild.id);
		const e = guild?.settings[setting];

		if (!e) {
			return otherwise;
		}

		return e;
	}

	async set(guild, setting, value) {
		if (!guild.settings) {
			guild.settings = {};
		}

		guild.settings[setting] = value;
		await STATEMENTS.insert.run(guild.id, JSON.stringify(guild.settings));
	}
}
