const TABLE_NAME = 'mod_action';

const STATEMENTS = {};

const init = async (client, db) => {
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
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
            );
	`);

	// Indexes for table above
	await db.run(`
        CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_id_idx        ON ${TABLE_NAME} (id);	-- Might be unnecessary
	`);

	await db.run(`
        CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_guild_idx     ON ${TABLE_NAME} (guild);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_moderator_idx ON ${TABLE_NAME} (moderator);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_target_idx    ON ${TABLE_NAME} (target);
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

	STATEMENTS.getIdMax = await db.prepare(`SELECT MAX(id) as length FROM ${TABLE_NAME} WHERE guild = ? LIMIT 1`);
};

const insert = ({ guild, action, moderator, target, aux, reason, passed, failedReason }) => {
	// using guild id twice here because there's an embedded query to get
	// an autoincrement id
	return STATEMENTS.insert.run(guild, guild, action, moderator, target, aux, reason, passed, failedReason, (new Date()).toISOString());
};

const forceInsert = ({ guild, action, moderator, target, aux, reason, passed, failedReason, timestamp }) => {
	return STATEMENTS.insert.run(guild, guild, action, moderator, target, aux, reason, passed, failedReason, timestamp);
};

const getAction = (guild, id) => {
	return STATEMENTS.getAction.get(guild, id);
};

const updateReason = ({ guild, id, reason }) => {
	return STATEMENTS.updateReason.run(reason, guild, id);
};

// this is stupid
const bulkInsert = async (params = []) => {
	// Should be a transaction
	return Promise.all(params.map(async p => {
		return insert(p);
	}));
};

// I am so sorry
const getModeratorTargetPage = ({ guild, moderator, target, lastId = Number.MAX_SAFE_INTEGER, perPage = 5 }) => {
	if (moderator && target) {
		return STATEMENTS.getModeratorTargetPage.all(guild, moderator, target, lastId, perPage);
	}

	if (moderator) {
		return STATEMENTS.getModeratorPage.all(guild, moderator, lastId, perPage);
	}

	if (target) {
		return STATEMENTS.getTargetPage.all(guild, target, lastId, perPage);
	}

	return STATEMENTS.getAllPage.all(guild, lastId, perPage);
};

const getIdMax = guild => {
	return STATEMENTS.getIdMax.get(guild);
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
