const db = require('./db');

const muteMember = async (guild, member, mutedRole, reason, duration) => {
	// if (member.roles.cache.has(mutedRole.id)) {
	// 	throw 'Member is already muted';
	// }

	// Will fix this
	await db.insert(guild.id, member.id, mutedRole.id, reason, duration.toISOString());
};

module.exports = {
	muteMember
};
