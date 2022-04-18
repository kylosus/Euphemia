const TAG_TABLE_NAME          = 'tag';
const SUBSCRIPTION_TABLE_NAME = 'subscription';
const TAG_MENTION_TABLE_NAME  = 'tag_mention';

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
		CREATE INDEX IF NOT EXISTS ${TAG_TABLE_NAME}_id_idx    ON ${TAG_TABLE_NAME} (id);	-- Might be unnecessary
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${TAG_TABLE_NAME}_guild_idx ON ${TAG_TABLE_NAME} (guild);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${TAG_TABLE_NAME}_name_idx  ON ${TAG_TABLE_NAME} (name);
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

	// =========================================================================
	// Tag Mention table
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${TAG_MENTION_TABLE_NAME}
			(
				id        INTEGER NOT NULL PRIMARY KEY,
				tag_id    INTEGER NOT NULL,
				user      INTEGER NOT NULL,
				channel   INTEGER NOT NULL,
				timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (tag_id) REFERENCES ${TAG_TABLE_NAME}(id)
			);
	`);

	await db.run(`
        CREATE INDEX IF NOT EXISTS ${TAG_MENTION_TABLE_NAME}_tag_id_idx ON ${TAG_MENTION_TABLE_NAME} (id);
	`);

	await db.run(`
        CREATE INDEX IF NOT EXISTS ${TAG_MENTION_TABLE_NAME}_tag_user_idx ON ${TAG_MENTION_TABLE_NAME} (user);
	`);
	// =========================================================================

	STATEMENTS.getTagCreator = await db.prepare(`
		SELECT
			id, creator
		FROM
			${TAG_TABLE_NAME}
		WHERE
			guild = @guildID AND name = @name
		LIMIT 1;
	`);

	STATEMENTS.createTag = await db.prepare(`
		INSERT INTO
			${TAG_TABLE_NAME} (guild, name, creator)
		VALUES(@guildID, @name, @creatorID);
	`);

	STATEMENTS.removeTagId = await db.prepare(`
		DELETE FROM
			${TAG_TABLE_NAME}
		WHERE
			id = @id;
	`);

	STATEMENTS.removeTag = await db.prepare(`
		DELETE FROM
			${TAG_TABLE_NAME}
		WHERE
			guild = @guildID AND name = @name; 
	`);

	STATEMENTS.disableTag = await db.prepare(`
		UPDATE
			${TAG_TABLE_NAME}
		SET
			enabled = 0
		WHERE
			guild = @guildID AND name = @name; 
	`);

	STATEMENTS.getTagsForward = await db.prepare(`
		SELECT
			id, MAX(tag.name) AS name, tag.enabled, COUNT(subscription.user) AS numSubscriptions
		FROM
			tag
		LEFT JOIN
			subscription ON subscription.tag_id = tag.id
		WHERE
			guild = @guildID AND id > @lastID and enabled = @enabled
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
			guild = @guildID AND id < @lastID and enabled = @enabled
		GROUP BY
			tag.id
		ORDER BY
			numSubscriptions DESC
		LIMIT
			@perPage;
	`);

	STATEMENTS.subscribeUserTo = await db.prepare(`
		INSERT INTO
			${SUBSCRIPTION_TABLE_NAME} (user, tag_id)
		SELECT
			user, tag_id
		FROM
			( SELECT @userID as user, id as tag_id from tag where name = @name )
	`);

	STATEMENTS.unsubscribeUserFrom = await db.prepare(`
		DELETE FROM
			${SUBSCRIPTION_TABLE_NAME}
		WHERE ROWID IN (
			SELECT
				s.ROWID
			FROM
				${SUBSCRIPTION_TABLE_NAME} as s
			JOIN
				${TAG_TABLE_NAME} as t
			ON
				s.tag_id = t.id AND t.name = @name
			WHERE
				t.guild = @guildID and s.user = @userID
			LIMIT 1
		);
	`);

	STATEMENTS.getSubscribedUsers = await db.prepare(`
		SELECT
			t.id, CAST(s.user as TEXT) as user
		FROM
			${TAG_TABLE_NAME} as t
		JOIN
			${SUBSCRIPTION_TABLE_NAME} as s
		ON
			t.id = s.tag_id
		WHERE
			name = @name AND guild = @guildID
	`);

	// Might be problematic if we have a lot of disabled tags
	// It's kiiinda inefficient now
	STATEMENTS.getTagIdMax = await db.prepare(`
		SELECT
			COUNT(id) as length
		FROM
			${TAG_TABLE_NAME}
		WHERE
			guild = @guildID AND enabled = @enabled
		LIMIT 1;
	`);

	STATEMENTS.registerTagMention = await db.prepare(`
		INSERT INTO
			${TAG_MENTION_TABLE_NAME} (tag_id, user, channel)
		VALUES(@tagID, @userID, @channelID);
	`);
};

const getTagCreator = async ({ guild, name }) => {
	return STATEMENTS.getTagCreator.get({ '@guildID': guild.id, '@name': name });
};

const createTag = async ({ guild, name, creator }) => {
	return STATEMENTS.createTag.run({ '@guildID': guild.id, '@name': name, '@creatorID': creator.id });
};

const removeTag = async ({ guild, name }) => {
	return STATEMENTS.removeTag.run({ '@guildID': guild.id, '@name': name });
};

const disableTag = async ({ guild, name }) => {
	return STATEMENTS.disableTag.run({ '@guildID': guild.id, '@name': name });
};

const getTagsForward = async ({ guild, lastID = 0, perPage = 5, enabled = true }) => {
	return STATEMENTS.getTagsForward.all({
		'@guildID': guild.id,
		'@lastID':  lastID,
		'@perPage': perPage,
		'@enabled': enabled
	});
};

const getTagsBackward = async ({ guild, prevID = 0, perPage = 5, enabled = true }) => {
	return STATEMENTS.getTagsBackward.all({
		'@guildID': guild.id,
		'@lastID':  prevID,
		'@perPage': perPage,
		'@enabled': enabled
	});
};

const subscribeUserTo = async ({ user, tagName }) => {
	return STATEMENTS.subscribeUserTo.run({ '@userID': user.id, '@name': tagName });
};

const unsubscribeUserFrom = async ({ guild, user, tagName }) => {
	return STATEMENTS.unsubscribeUserFrom.run({ '@guildID': guild.id, '@userID': user.id, '@name': tagName });
};

const getSubscribedUsers = async ({ guild, name }) => {
	return STATEMENTS.getSubscribedUsers.all({ '@guildID': guild.id, '@name': name });
};

const getTagIdMax = ({ guild, enabled = true }) => {
	return STATEMENTS.getTagIdMax.get({ '@guildID': guild.id, '@enabled': enabled });
};

const registerTagMention = ({ tagID, user, channel }) => {
	return STATEMENTS.registerTagMention.run({ '@tagID': tagID, '@userID': user.id, '@channelID': channel.id });
};

export {
	init,
	getTagCreator,
	createTag,
	removeTag,
	disableTag,
	getTagsForward,
	getTagsBackward,
	subscribeUserTo,
	unsubscribeUserFrom,
	getSubscribedUsers,
	getTagIdMax,
	registerTagMention
};
