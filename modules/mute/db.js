const TABLE_NAME = 'muted_members';

const STATEMENTS = {};

const init = async (client, db) => {
	await db.run(
		`CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
                  (
                      guild INTEGER,
                      member INTEGER,
                      mutedRole INTEGER,
                      reason TEXT,
                      expires TEXT,
                      PRIMARY KEY (guild, member)
                  )
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
	insert,
	getExpired,
	remove
};
