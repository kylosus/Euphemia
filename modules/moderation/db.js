const TABLE_NAME = 'mod_action';

const STATEMENTS = {};

const init = async (client, db) => {
	await db.run(
		`CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
            (
                id        INTEGER NOT NULL,
                guild     INTEGER NOT NULL,
                action    TEXT    NOT NULL,
                moderator INTEGER NOT NULL,
                target    INTEGER NOT NULL,
                aux       TEXT DEFAULT NULL,
                reason    TEXT DEFAULT NULL,
                passed    BOOLEAN DEFAULT FALSE,
                failedReason TEXT DEFAULT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id, guild)
            )
	`);

	STATEMENTS.insert = await db.prepare(`
		INSERT INTO
		    ${TABLE_NAME} (id, guild, action, moderator, target, aux, reason, passed, failedReason, timestamp)
		VALUES ((SELECT IFNULL(MAX(id), 0) + 1 FROM ${TABLE_NAME} where guild = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`);
};

const insert = async ({guild, action, moderator, target, aux, reason, passed, failedReason}) => {
	// using guild id twice here because there's an embedded query to get
	// an autoincrement id
	await STATEMENTS.insert.run(guild, guild, action, moderator, target, aux, reason, passed, failedReason, (new Date()).toISOString());
};

// this is stupid
const bulkInsert = async (params = []) => {
	return await Promise.all(params.map(async p => {
		return await insert(p);
	}));
};

module.exports = {
	init,
	insert,
	bulkInsert
};
