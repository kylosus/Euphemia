import { insert, remove } from './db.js';

const muteMember = async (guild, member, mutedRole, reason, duration) => {
	await insert(guild.id, member.id, mutedRole.id, reason, duration);
};

// eslint-disable-next-line no-unused-vars
const unmuteMemberRaw = async (guild, member, mutedRole) => {
	// ~
};

const unmuteMember = async (guild, member, mutedRole, reason = 'Unmuted') => {
	await member.roles.remove(mutedRole, reason);
	await remove(guild.id, member.id);
};

export {
	muteMember,
	unmuteMemberRaw,
	unmuteMember
};
