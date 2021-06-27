const db = require('./db');

const muteMember = async (guild, member, mutedRole, reason, duration) => {
	await db.insert(guild.id, member.id, mutedRole.id, reason, duration.toISOString());
};

module.exports = {
	muteMember
};
