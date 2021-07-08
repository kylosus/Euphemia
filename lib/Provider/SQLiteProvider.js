// I DON'T KNOW WHEN OR IF THE GUILD CACHE IS INVALIDATED
// I AM SAVING SETTINGS DIRECTLY INSIDE THE CACHED GUILD OBJECT
// TO AVOID MAKING A MAP LOOKUP, BUT IF IT IS EVER INVALIDATED
// AND OVERWRITTEN, ALL SETTINGS ARE GONE


const Provider = require('./Provider');

const STATEMENTS = {
	insert: null
};

const TABLE_NAME = 'settings';

class SQLiteProvider extends Provider {
	constructor(db) {
		super();
		this.db = db;

		this.settings = new Map();

		this.init();
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (guild INTEGER PRIMARY KEY, settings TEXT)`);

		STATEMENTS.insert =  await this.db.prepare(`INSERT OR REPLACE INTO ${TABLE_NAME} VALUES(?, ?)`);
	}

	async loadGuilds(guilds) {
		const rows = await this.db.all(`SELECT CAST(guild as TEXT) as guild, settings FROM ${TABLE_NAME}`);

		for (const row of rows) {
			const guildID = row.guild;

			const settings = (s => {
				try {
					return JSON.parse(s);
				} catch (err) {
					throw `SQLiteProvider couldn't parse the settings stored for guild ${row.guild}.`;
				}
			})(row.settings);

			const guild = guilds.get(guildID);

			if (!guild) {
				continue;
			}

			this.settings.set(guildID, settings);
			guild.settings = settings;

			// Override guild.provider
			guild.provider = {
				get: (...args) => {
					return this.get(guild, ...args);
				},

				set: (...args) => {
					return this.set(guild, ...args);
				}
			};

		}

		guilds.forEach(g => g.settings = g.settings || {});
	}

	get(guild, setting, otherwise = null) {
		// const e = this.settings.get(guild.id);
		const e = guild.settings[setting];

		if (!e) {
			return otherwise;
		}

		return e;
	}

	async set(guild, setting, value) {
		guild.settings[setting] = value;
		await STATEMENTS.insert.run(guild.id, JSON.stringify(guild.settings));
	}
}

module.exports = SQLiteProvider;
