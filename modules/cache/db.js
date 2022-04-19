export const USERS_TABLE_NAME       = 'users';
export const GUILDS_TABLE_NAME      = 'guilds';
export const MEMBERSHIPS_TABLE_NAME = 'memberships';

let db           = null;
const STATEMENTS = {};

const init = async (client, _db) => {
	db = _db;

	// =========================================================================
	// Users table
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${USERS_TABLE_NAME}
			(
				id            INT     NOT NULL PRIMARY KEY,
				username      TEXT    NOT NULL,
				discriminator TEXT    NOT NULL,
				createdAt     TEXT    NOT NULL
			);
	`);
	// =========================================================================

	// =========================================================================
	// Guilds table
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${GUILDS_TABLE_NAME}
			(
				id        INT     NOT NULL PRIMARY KEY,
				name      TEXT    NOT NULL
			);
	`);
	// =========================================================================

	// =========================================================================
	// Memberships table
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${MEMBERSHIPS_TABLE_NAME}
			(
				user_id   INTEGER NOT NULL,
				guild_id  INTEGER NOT NULL,
				FOREIGN KEY (user_id)  REFERENCES ${USERS_TABLE_NAME}  (id),
				FOREIGN KEY (guild_id) REFERENCES ${GUILDS_TABLE_NAME} (id),
				PRIMARY KEY (user_id, guild_id)
			);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${MEMBERSHIPS_TABLE_NAME}_tag_user_id_idx  ON ${MEMBERSHIPS_TABLE_NAME} (user_id);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${MEMBERSHIPS_TABLE_NAME}_tag_guild_id_idx ON ${MEMBERSHIPS_TABLE_NAME} (guild_id);
	`);
	// =========================================================================

	STATEMENTS.insertUser = await db.prepare(`
		INSERT OR IGNORE INTO
			${USERS_TABLE_NAME}
		VALUES
			( @id, @username, @discriminator, @createdAt );
	`);

	STATEMENTS.insertGuild = await db.prepare(`
		INSERT OR IGNORE INTO
			${GUILDS_TABLE_NAME}
		VALUES
			( @id, @name );
	`);

	STATEMENTS.insertMembership = await db.prepare(`
		INSERT OR IGNORE INTO
			${MEMBERSHIPS_TABLE_NAME} (user_id, guild_id)
		VALUES
			( @userID, @guildID );
	`);

	STATEMENTS.deleteMembership = await db.prepare(`
		DELETE FROM
			${MEMBERSHIPS_TABLE_NAME}
		WHERE
			( user_id = @userID AND guild_id = @guildID );
	`);

	STATEMENTS.deleteMemberships = await db.prepare(`
		DELETE FROM
			${MEMBERSHIPS_TABLE_NAME};
	`);
};

const insertUser = async ({ user }) => {
	return STATEMENTS.insertUser.run({
		'@id':            user.id,
		'@username':      user.username,
		'@discriminator': user.discriminator,
		'@createdAt':     user.createdAt.toISOString()
	});
};

const insertGuild = async ({ guild }) => {
	return STATEMENTS.insertGuild.run({
		'@id':   guild.id,
		'@name': guild.name
	});
};

const insertMembership = async ({ member }) => {
	return STATEMENTS.insertMembership.run({
		'@userID':  member.id,
		'@guildID': member.guild.id
	});
};

const _registerMember = async (member) => {
	await insertUser({ user: member.user });
	await insertGuild({ guild: member.guild });
	await insertMembership({ member });
};

const registerMember = async ({ member }) => {
	await db.exec('BEGIN');

	// Should I serialize this?
	try {
		await _registerMember(member);
	} catch (err) {
		await db.exec('ROLLBACK');
		throw err;
	}

	await db.exec('COMMIT');
};

const deregisterMember = async ({ member }) => {
	return STATEMENTS.deleteMembership.run({
		'@userID':  member.id,
		'@guildID': member.guild.id
	});
};

const _registerEntireGuild = async guild => {
	const members = await guild.members.fetch();

	return Promise.all(members.map(async m => {
		return _registerMember(m);
	}));
};

const registerEntireGuild = async ({ guild }) => {
	await db.exec('BEGIN');

	try {
		await _registerEntireGuild(guild);
	} catch (err) {
		await db.exec('ROLLBACK');
		throw err;
	}

	await db.exec('COMMIT');
};

const registerAllGuilds = async ({ client }) => {
	await db.exec('BEGIN');

	try {
		await STATEMENTS.deleteMemberships.run();

		await Promise.all(client.guilds.cache.map(async guild => {
			return _registerEntireGuild(guild);
		}));
	} catch (err) {
		await db.exec('ROLLBACK');
		throw err;
	}

	await db.exec('COMMIT');
};

export {
	init,
	insertUser,
	insertGuild,
	insertMembership,
	registerMember,
	deregisterMember,
	registerEntireGuild,
	registerAllGuilds
};
