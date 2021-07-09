const db = require('./db');

const muteMember = async (guild, member, mutedRole, reason, duration) => {
	await db.insert(guild.id, member.id, mutedRole.id, reason, duration);
};

// eslint-disable-next-line no-unused-vars
const unmuteMemberRaw = async (guild, member, mutedRole) => {
	// ~
};

const unmuteMember = async (guild, member, mutedRole, reason = 'Unmuted') => {
	await member.roles.remove(mutedRole, reason);
	await db.remove(guild.id, member.id);
};

module.exports = {
	muteMember,
	unmuteMemberRaw,
	unmuteMember
};
