import { ModerationCommandResult } from '../../modules/moderation/index.js';

export const banUsers = async ({ message, users, deleteMessageDays = 0, reason }) => {
	const result = new ModerationCommandResult(reason);

	await Promise.all(users.map(async user => {
		const member = await message.guild.members.fetch({ user }).catch(() => {});

		if (member && !member.bannable) {
			return result.addFailed(user, 'Missing permissions');
		}

		try {
			await message.guild.members.ban(user.id, { deleteMessageDays, reason });
		} catch (err) {
			return result.addFailed(user, err.message);
		}

		result.addPassed(user);
	}));

	return result;
};
