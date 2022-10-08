import { ModerationCommandResult } from '../../modules/moderation/index.js';

export const banUsers = async ({ message, users, deleteMessageDays = 0, reason }) => {
	const result = new ModerationCommandResult(reason);

	await Promise.all(users.map(async user => {
		const member = await message.guild.members.fetch({ user }).catch(() => {});

		// If client can't ban
		if (!member?.bannable) {
			return result.addFailed(user, 'Missing client permissions');
		}

		// If the command author can't ban
		if (member?.roles?.highest?.comparePositionTo(message.member.roles.highest) >= 0) {
			return result.addFailed(user, 'Missing user permissions');
		}

		try {
			await message.guild.members.ban(user, { deleteMessageDays, reason });
		} catch (err) {
			return result.addFailed(user, err.message);
		}

		result.addPassed(user);
	}));

	return result;
};

// Duplicated code, but whatever
export const banMembers = async ({ message, members, deleteMessageDays = 0, reason }) => {
	const result = new ModerationCommandResult(reason);

	await Promise.all(members.map(async member => {
		// If client can't ban
		if (!member?.bannable) {
			return result.addFailed(member, 'Missing client permissions');
		}

		// If the command author can't ban
		if (member?.roles?.highest?.comparePositionTo(message.member.roles.highest) >= 0) {
			return result.addFailed(member, 'Missing user permissions');
		}

		try {
			await message.guild.members.ban(member, { deleteMessageDays, reason });
		} catch (err) {
			return result.addFailed(member, err.message);
		}

		result.addPassed(member);
	}));

	return result;
};
