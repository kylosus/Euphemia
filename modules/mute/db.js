const TABLE_NAME = 'muted_members';

const STATEMENTS = {};

const init = async (client, db) => {
	await db.run(
		`CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
                  (
                      guild INTEGER NOT NULL,
                      member INTEGER NOT NULL,
                      mutedRole INTEGER NOT NULL,
                      reason TEXT,
                      expires TEXT NOT NULL,
                      PRIMARY KEY (guild, member)
                  )
	`);

	STATEMENTS.getMutedRoleIfNotExpired = await db.prepare(`
		SELECT
		    CAST(mutedrole as TEXT) as mutedRole,
		    expires
		FROM ${TABLE_NAME} where member = ? and expires > date('now')
	`);
	STATEMENTS.insert = await db.prepare(`INSERT OR REPLACE INTO ${TABLE_NAME} VALUES (?, ?, ?, ?, ?)`);
	STATEMENTS.delete = await db.prepare(`DELETE FROM ${TABLE_NAME} WHERE guild = ? and member = ?`);
	STATEMENTS.getExpired = await db.prepare(`
		SELECT
			CAST(guild as TEXT) as guild,
			CAST(member as TEXT) as member,
			CAST(mutedRole as TEXT) as mutedRole
		FROM ${TABLE_NAME} where expires < date('now')
	`);
};

const getMutedRoleIfNotExpired = async member => {
	return await STATEMENTS.getMutedRoleIfNotExpired.get(member);
};

const insert = async (guild, member, mutedRole, reason, expires) => {
	await STATEMENTS.insert.run(guild, member, mutedRole, reason, expires);
};

const getExpired = async () => {
	return await STATEMENTS.getExpired.all();
};

const remove = async (guild, member) => {
	return await STATEMENTS.delete.run(guild, member);
};

module.exports = {
	init,
	getMutedRoleIfNotExpired,
	insert,
	getExpired,
	remove
};
