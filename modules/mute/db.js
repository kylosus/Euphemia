import dayjs from 'dayjs';

const TABLE_NAME = 'muted_members';

const STATEMENTS = {};

const init = async (client, db) => {
	await db.run(`
		CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
			(
			  guild     INTEGER NOT NULL,
			  member    INTEGER NOT NULL,
			  mutedRole INTEGER NOT NULL,
			  reason    TEXT,
			  expires   TEXT NOT NULL,
			  PRIMARY KEY (guild, member)
			);
	`);

	// Index for the table above
	await db.run(`
		CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_guild_idx   ON ${TABLE_NAME} (guild);
	`);

	await db.run(`
		CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_expires_idx ON ${TABLE_NAME} (expires);
	`);

	STATEMENTS.getMutedRoleIfNotExpired = await db.prepare(`
		SELECT
			CAST(mutedrole as TEXT) as mutedRole, expires
		FROM
			${TABLE_NAME}
		WHERE
			member = @memberID AND expires > @expires;
	`);

	// guild.id, member.id, mutedRole.id, reason, expires
	STATEMENTS.insert = await db.prepare(`
		INSERT OR REPLACE INTO
			${TABLE_NAME}
		VALUES (@guildID, @memberID, @mutedRoleID, @reason, @expires);
	`);

	STATEMENTS.delete     = await db.prepare(`DELETE FROM ${TABLE_NAME} WHERE guild = @guildID and member = @memberID`);
	STATEMENTS.getExpired = await db.prepare(`
		SELECT
			CAST(guild     as TEXT) as guild,
			CAST(member    as TEXT) as member,
			CAST(mutedRole as TEXT) as mutedRole
		FROM
			${TABLE_NAME}
		WHERE
			expires < @expires;
	`);
};

const getMutedRoleIfNotExpired = ({ member }) => {
	return STATEMENTS.getMutedRoleIfNotExpired.get({
		'@memberID': member.id,
		'@expires':  dayjs().toISOString()
	});
};

const insert = ({ guild, member, mutedRole, reason, expires }) => {
	return STATEMENTS.insert.run({
		'@guildID':     guild.id,
		'@memberID':    member.id,
		'@mutedRoleID': mutedRole.id,
		'@reason':      reason,
		'@expires':     expires
	});
};

const getExpired = () => {
	// replace with .each()?
	return STATEMENTS.getExpired.all({ '@expires': dayjs().toISOString() });
};

const removeID = ({ guildID, memberID }) => {
	return STATEMENTS.delete.run({ '@guildID': guildID, '@memberID': memberID });
};

const remove = ({ guild, member }) => {
	return removeID({ guildID: guild.id, memberID: member.id });
};

export {
	init,
	getMutedRoleIfNotExpired,
	insert,
	getExpired,
	removeID,
	remove
};
