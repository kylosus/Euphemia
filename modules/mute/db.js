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
};

const insert = async (guild, member, mutedRole, reason, expires) => {
	await STATEMENTS.insert.run(guild, member, mutedRole, reason, expires);
};

module.exports = {
	init,
	insert
};
