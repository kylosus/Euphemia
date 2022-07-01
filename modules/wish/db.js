const WISH_TABLE_NAME = 'wish';

const STATEMENTS = {};

const init = async (client, db) => {
	// =========================================================================
	// Tag table
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${WISH_TABLE_NAME}
			(
				user      INTEGER NOT NULL PRIMARY KEY,
				message   INTEGER NOT NULL,
				wish      TEXT    NOT NULL
			);
	`);

	// Indexes for table above
	await db.run(`
		CREATE INDEX IF NOT EXISTS ${WISH_TABLE_NAME}_user_idx ON ${WISH_TABLE_NAME} (user);
	`);
	// =========================================================================

	STATEMENTS.getWishMessage = await db.prepare(`
		SELECT
			CAST(message as TEXT) as message
		FROM
			${WISH_TABLE_NAME}
		WHERE
			user = @userID
		LIMIT 1;
	`);

	STATEMENTS.addWish = await db.prepare(`
		REPLACE INTO
			${WISH_TABLE_NAME} (user, wish, message)
		VALUES(@userID, @wish, @messageID);
	`);
};

const getWishMessage = async ({ user }) => {
	return STATEMENTS.getWishMessage.get({ '@userID': user.id });
};

const addWish = async ({ user, wish, message }) => {
	return STATEMENTS.addWish.run(
		{ '@userID': user.id, '@wish': wish, '@messageID': message.id }
	);
};

export {
	init,
	getWishMessage,
	addWish
};
