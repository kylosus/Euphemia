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
-- 		RETURNING id
	`);

	STATEMENTS.getAction = await db.prepare(`
		SELECT
            id, action, aux, reason, passed, failedReason, timestamp,
            CAST(moderator as TEXT) as moderator,
            CAST(target as TEXT) as target
        FROM ${TABLE_NAME}
		WHERE guild = ? AND id = ?
		LIMIT 1
	`);

	STATEMENTS.updateReason = await db.prepare(`
		UPDATE ${TABLE_NAME} SET reason = ? where guild = ? AND id = ?
	`);

	// guild, moderator, lastValue, perPage
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

	// guild, target, lastValue, perPage
	STATEMENTS.getTargetPage = await db.prepare(`
        SELECT
            id, action, aux, passed,
            CAST(moderator as TEXT) as moderator,
            CAST(target as TEXT) as target
        FROM ${TABLE_NAME}
        WHERE guild = ? AND target = ?
          AND id < ?
        ORDER BY id DESC
            LIMIT ?
	`);

	// guild, moderator, target, lastId, perPage
	STATEMENTS.getModeratorTargetPage = await db.prepare(`
        SELECT
            id, action, aux, passed,
            CAST(moderator as TEXT) as moderator,
            CAST(target as TEXT) as target
        FROM ${TABLE_NAME}
        WHERE guild = ? AND moderator = ? AND target = ?
          AND id < ?
        ORDER BY id DESC
            LIMIT ?
	`);

	// guild, lastId, perPage
	STATEMENTS.getAllPage = await db.prepare(`
        SELECT
            id, action, aux, passed,
            CAST(moderator as TEXT) as moderator,
            CAST(target as TEXT) as target
        FROM ${TABLE_NAME}
        WHERE guild = ?
          AND id < ?
        ORDER BY id DESC
            LIMIT ?
	`);

	STATEMENTS.getIdMax = await db.prepare(`SELECT MAX(id) as length from ${TABLE_NAME} where guild = ? LIMIT 1`);
};

const insert = async ({ guild, action, moderator, target, aux, reason, passed, failedReason }) => {
	// using guild id twice here because there's an embedded query to get
	// an autoincrement id
	return await STATEMENTS.insert.run(guild, guild, action, moderator, target, aux, reason, passed, failedReason, (new Date()).toISOString());
};

const forceInsert = async ({ guild, action, moderator, target, aux, reason, passed, failedReason, timestamp }) => {
	return await STATEMENTS.insert.run(guild, guild, action, moderator, target, aux, reason, passed, failedReason, timestamp);
};

const getAction = async (guild, id) => {
	return await STATEMENTS.getAction.get(guild, id);
};

const updateReason = async ({ guild, id, reason }) => {
	return await STATEMENTS.updateReason.run(reason, guild, id);
};

// this is stupid
const bulkInsert = async (params = []) => {
	return await Promise.all(params.map(async p => {
		return await insert(p);
	}));
};

// I am so sorry
const getModeratorTargetPage = async ({ guild, moderator, target, lastId = Number.MAX_SAFE_INTEGER, perPage = 5 }) => {
	if (moderator && target) {
		return await STATEMENTS.getModeratorTargetPage.all(guild, moderator, target, lastId, perPage);
	}

	if (moderator) {
		return await STATEMENTS.getModeratorPage.all(guild, moderator, lastId, perPage);
	}

	if (target) {
		return await STATEMENTS.getTargetPage.all(guild, target, lastId, perPage);
	}

	return await STATEMENTS.getAllPage.all(guild, lastId, perPage);
};

const getIdMax = async guild => {
	return await STATEMENTS.getIdMax.get(guild);
};

module.exports = {
	init,
	insert,
	forceInsert,
	getAction,
	updateReason,
	bulkInsert,
	getModeratorTargetPage,
	getIdMax
};
