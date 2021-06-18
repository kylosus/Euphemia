// I DON'T KNOW WHEN OR IF THE GUILD CACHE IS INVALIDATED
// I AM SAVING SETTINGS DIRECTLY INSIDE THE CACHED GUILD OBJECT
// TO AVOID MAKING A MAP LOOKUP, BUT IF IT IS EVER INVALIDATED
// AND OVERWRITEN, ALL SETTINGS ARE GONE


const Provider = require('./Provider');

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
	}

	async loadGuilds(guilds) {
		const rows = await this.db.all(`SELECT CAST(guild as TEXT) as guild, settings FROM ${TABLE_NAME}`);
		// const rows = await this.db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (guild INTEGER PRIMARY KEY, settings TEXT)`);

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
		}
	}

	get(guild, setting, otherwise = null) {
		// const e = this.settings.get(guild.id);
		const e = guild.settings[setting];

		if (!e) {
			return otherwise;
		}

		return e;
	}

	set(guild, setting, value) {
		const e = guild.settings[setting];

		if (!e) {
			// How?
			return;
		}

		e[setting] = value;
	}
}

module.exports = SQLiteProvider;
