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

	// guild, moderator, lastValue, limit
	STATEMENTS.getModeratorPage = await db.prepare(`
		SELECT
			id, action, aux, passed,
        	CAST(moderator as TEXT) as moderator,
        	CAST(target as TEXT) as target
		FROM ${TABLE_NAME}
		WHERE guild = ? AND moderator = ?
			AND id < ?
		ORDER BY id DESC
		LIMIT ?
	`);

	STATEMENTS.getTargetPage = await db.prepare(`
		SELECT * FROM ${TABLE_NAME} where guild = ? and target = ?
	`);

	STATEMENTS.getModeratorTargetPage = await db.prepare(`
		SELECT * FROM ${TABLE_NAME} where guild = ? and moderator = ? and target = ?
	`);

	STATEMENTS.getIdMax = await db.prepare(`SELECT MAX(id) as length from ${TABLE_NAME} where guild = ? LIMIT 1`);
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

// I am so sorry
const getModeratorTargetPage = async ({guild, moderator, target, lastId = Number.MAX_SAFE_INTEGER, perPage = 5}) => {
	return await STATEMENTS.getModeratorPage.all(guild, moderator, lastId, perPage);

	/*
	if (moderator && target) {
		return await STATEMENTS.getModeratorTargetPage.all(guild, moderator, target);
	}

	if (moderator) {
		return await STATEMENTS.getModeratorPage.all(guild, moderator);
	}

	return await STATEMENTS.getTargetPage.all(guild, target);
	 */
};

const getIdMax = async guild => {
	return await STATEMENTS.getIdMax.get(guild);
};

module.exports = {
	init,
	insert,
	bulkInsert,
	getModeratorTargetPage,
	getIdMax
};
