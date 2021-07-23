const moment = require('moment');

const TABLE_NAME = 'muted_members';

const STATEMENTS = {};

const init = async (client, db) => {
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
			(
			  guild INTEGER NOT NULL,
			  member INTEGER NOT NULL,
			  mutedRole INTEGER NOT NULL,
			  reason TEXT,
			  expires TEXT NOT NULL,
			  PRIMARY KEY (guild, member)
			);
	`);

	// Index for the table above
	await db.run(`
        CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_guild_idx   ON ${TABLE_NAME} (guild);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_expires_idx ON ${TABLE_NAME} (expires);
	`);

	STATEMENTS.getMutedRoleIfNotExpired = await db.prepare(`
		SELECT
		    CAST(mutedrole as TEXT) as mutedRole,
		    expires
		FROM ${TABLE_NAME} where member = ? and expires > ?
	`);

	STATEMENTS.insert = await db.prepare(`INSERT OR REPLACE INTO ${TABLE_NAME} VALUES (?, ?, ?, ?, ?)`);
	STATEMENTS.delete = await db.prepare(`DELETE FROM ${TABLE_NAME} WHERE guild = ? and member = ?`);
	STATEMENTS.getExpired = await db.prepare(`
		SELECT
			CAST(guild as TEXT) as guild,
			CAST(member as TEXT) as member,
			CAST(mutedRole as TEXT) as mutedRole
		FROM ${TABLE_NAME} where expires < ?
	`);
};

const getMutedRoleIfNotExpired = member => {
	return STATEMENTS.getMutedRoleIfNotExpired.get(member, moment().toISOString());
};

const insert = (guild, member, mutedRole, reason, expires) => {
	return STATEMENTS.insert.run(guild, member, mutedRole, reason, expires);
};

const getExpired = () => {
	// replace with .each()?
	return STATEMENTS.getExpired.all(moment().toISOString());
};

const remove = (guild, member) => {
	return STATEMENTS.delete.run(guild, member);
};

module.exports = {
	init,
	getMutedRoleIfNotExpired,
	insert,
	getExpired,
	remove
};
