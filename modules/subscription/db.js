const TAG_TABLE_NAME          = 'tag';
const SUBSCRIPTION_TABLE_NAME = 'subscription';

const STATEMENTS = {};

const init = async (client, db) => {
	// =========================================================================
	// Tag table
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${TAG_TABLE_NAME}
            (
                id        INTEGER NOT NULL PRIMARY KEY,
                guild     INTEGER NOT NULL,
                name      TEXT    NOT NULL,
                creator   INTEGER NOT NULL,
                enabled   BOOLEAN DEFAULT TRUE,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT unq UNIQUE (guild, name)
            );
	`);

	// Indexes for table above
	await db.run(`
        CREATE INDEX IF NOT EXISTS ${TAG_TABLE_NAME}_id_idx        ON ${TAG_TABLE_NAME} (id);	-- Might be unnecessary
	`);

	await db.run(`
        CREATE INDEX IF NOT EXISTS ${TAG_TABLE_NAME}_guild_idx     ON ${TAG_TABLE_NAME} (guild);
	`);

	await db.run(`
        CREATE INDEX IF NOT EXISTS ${TAG_TABLE_NAME}_name_idx      ON ${TAG_TABLE_NAME} (name);
	`);
	// =========================================================================

	// =========================================================================
	// Subscription table
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${SUBSCRIPTION_TABLE_NAME}
            (
            	tag_id    INTEGER NOT NULL,
                user      INTEGER NOT NULL,
                FOREIGN KEY (tag_id) REFERENCES ${TAG_TABLE_NAME}(id)
                PRIMARY KEY (tag_id, user)
            );
	`);

	await db.run(`
        CREATE INDEX IF NOT EXISTS ${SUBSCRIPTION_TABLE_NAME}_tag_id_idx ON ${SUBSCRIPTION_TABLE_NAME} (tag_id);
	`);

	await db.run(`
        CREATE INDEX IF NOT EXISTS ${SUBSCRIPTION_TABLE_NAME}_user_idx   ON ${SUBSCRIPTION_TABLE_NAME} (user);
	`);
	// =========================================================================

	STATEMENTS.createTag = await db.prepare(`
		INSERT INTO
		    ${TAG_TABLE_NAME} (guild, name, creator)
		VALUES(@guildID, @name, @creatorID);
	`);

	STATEMENTS.removeTag = await db.prepare(`
		DELETE FROM
		    ${TAG_TABLE_NAME}
		WHERE guild = @guildID AND name = @name; 
	`);

	// STATEMENTS.getTags = await db.prepare(`
	// 	SELECT
	// 		id, name, enabled
	// 	FROM ${TAG_TABLE_NAME}
	// 	WHERE
	// 		guild = @guild AND id < @lastID
	// 	ORDER BY id DESC
	// 		LIMIT @perPage
	// `);

	STATEMENTS.getTagsForward = await db.prepare(`
		SELECT
			id, MAX(tag.name) AS name, tag.enabled, COUNT(subscription.user) AS numSubscriptions
		FROM
			tag
		LEFT JOIN
			subscription ON subscription.tag_id = tag.id
		WHERE
			guild = @guild AND id > @lastID
		GROUP BY
			tag.id
		ORDER BY
			numSubscriptions DESC
		LIMIT
			@perPage;
	`);

	STATEMENTS.getTagsBackward = await db.prepare(`
		SELECT
			id, MAX(tag.name) AS name, tag.enabled, COUNT(subscription.user) AS numSubscriptions
		FROM
			tag
		LEFT JOIN
			subscription ON subscription.tag_id = tag.id
		WHERE
			guild = @guild AND id < @lastID
		GROUP BY
			tag.id
		ORDER BY
			numSubscriptions DESC
		LIMIT
			@perPage;
	`);

	STATEMENTS.subscribeUserTo = await db.prepare(`
		INSERT INTO ${SUBSCRIPTION_TABLE_NAME} (user, tag_id) VALUES(
			( @user ),
			(SELECT id from ${TAG_TABLE_NAME} WHERE name = @tagName ));
	`);

	STATEMENTS.getSubscribedUsers = await db.prepare(`
		SELECT
			s.user
		FROM
			${TAG_TABLE_NAME} as t
		LEFT JOIN
			${SUBSCRIPTION_TABLE_NAME} as s
		ON
			t.id = s.tag_id
		WHERE
			name = @name AND guild = @guildID
	`);

	STATEMENTS.getTagIdMax = await db.prepare(`SELECT MAX(id) as length FROM ${TAG_TABLE_NAME} WHERE guild = @guild LIMIT 1`);
};

const createTag = async ({ guild, name, creator }) => {
	return STATEMENTS.createTag.run({ '@guildID': guild.id, '@name': name, '@creatorID': creator.id });
};

const removeTag = async ({ guild, name }) => {
	return STATEMENTS.removeTag.run({ '@guildID': guild.id, '@name': name });
};

const getTagsForward = async ({ guild, lastID = 0, perPage = 5 }) => {
	return STATEMENTS.getTagsForward.all({ '@guild': guild.id, '@lastID': lastID, '@perPage': perPage });
};

const getTagsBackward = async ({ guild, prevID = 0, perPage = 5 }) => {
	return STATEMENTS.getTagsBackward.all({ '@guild': guild.id, '@lastID': prevID, '@perPage': perPage });
};

const subscribeUserTo = async ({ user, tagName }) => {
	return STATEMENTS.subscribeUserTo.run({ '@user': user.id, '@tagName': tagName });
};

const getSubscribedUsers = async ({ guild, name }) => {
	return STATEMENTS.getSubscribedUsers.all({ '@guildID': guild.id, '@name': name });
};

const getTagIdMax = ({ guild }) => {
	return STATEMENTS.getTagIdMax.get({ '@guild': guild.id });
};

export {
	init,
	createTag,
	removeTag,
	getTagsForward,
	getTagsBackward,
	subscribeUserTo,
	getSubscribedUsers,
	getTagIdMax
};
