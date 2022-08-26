import { Permissions }                                from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'ban',
			aliases:           ['ban', 'b', 'deport'],
			description:       {
				content:  'Bans a user.',
				usage:    '<user> [user2...] [reason]',
				examples: ['ban @user', 'ban @user1 @user2', 'ban 275331662865367040'],
			},
			userPermissions:   [Permissions.FLAGS.BAN_MEMBERS],
			clientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
			args:              [
				{
					id:      'users',
					type:    ArgConsts.TYPE.USERS,
					message: 'Please mention users to ban'
				},
				{
					id:       'reason',
					type:     ArgConsts.TYPE.REASON,
					optional: true,
					default:  () => null,
				},
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { users, reason }) {
		const result = new ModerationCommandResult(reason);

		await Promise.all(users.map(async user => {
			const member = await message.guild.members.fetch(user);

			if (member && !member.bannable) {
				return result.addFailed(user, 'Member too high in the hierarchy');
			}

			try {
				await message.guild.members.ban(user, { days: 0, reason });
			} catch (err) {
				return result.addFailed(user, err.message);
			}

			result.addPassed(user);
		}));

		return result;
	}
}
