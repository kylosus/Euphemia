import { USERS_TABLE_NAME } from '../cache/db.js';

const ANILIST_TABLE_NAME = 'anilist';

const STATEMENTS = {};

const init = async (client, db) => {
	// =========================================================================
	// Anilist table
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${ANILIST_TABLE_NAME}
			(
				user_id          INTEGER NOT NULL,
				anilist_id       INTEGER NOT NULL,
				anilist_username TEXT NOT NULL,
				FOREIGN KEY (user_id) REFERENCES ${USERS_TABLE_NAME} (id),
				PRIMARY KEY (user_id, anilist_id)
			);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${ANILIST_TABLE_NAME}_tag_user_id_idx          ON ${ANILIST_TABLE_NAME} (user_id);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${ANILIST_TABLE_NAME}_tag_anilist_id_idx       ON ${ANILIST_TABLE_NAME} (anilist_id);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${ANILIST_TABLE_NAME}_tag_anilist_username_idx ON ${ANILIST_TABLE_NAME} (anilist_username);
	`);
	// =========================================================================

	STATEMENTS.insertAnilist = await db.prepare(`
		INSERT OR REPLACE INTO
			${ANILIST_TABLE_NAME}
		VALUES
			( @userID, @anilistID, @anilistUsername );
	`);
};

const insertAnilist = ({ user, anilistID, anilistUsername }) => {
	return STATEMENTS.insertAnilist.run({
		'@userID':          user.id,
		'@anilistID':       anilistID,
		'@anilistUsername': anilistUsername
	});
};

export {
	init,
	insertAnilist
};
