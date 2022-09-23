import { PermissionsBitField }                        from 'discord.js';
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
			userPermissions:   [PermissionsBitField.Flags.BanMembers],
			clientPermissions: [PermissionsBitField.Flags.BanMembers],
			args:              [
				{
					id:          'users',
					type:        ArgConsts.TYPE.USERS,
					description: 'User to ban',
					message:     'Please mention users to ban'
				},
				{
					id:          'reason',
					type:        ArgConsts.TYPE.REASON,
					description: 'Reason for the ban',
					optional:    true,
					defaultFunc: () => null,
				},
			],
			guildOnly:         true,
			ownerOnly:         false,
			slash:             true
		});
	}

	async run(message, { users, reason }) {
		const result = new ModerationCommandResult(reason);

		await Promise.all(users.map(async user => {
			const member = await message.guild.members.fetch({ user }).catch(() => {
			});

			if (member && !member.bannable) {
				return result.addFailed(user, 'Member too high in the hierarchy');
			}

			try {
				await message.guild.members.ban(user.id, { deleteMessageDays: 0, reason });
			} catch (err) {
				return result.addFailed(user, err.message);
			}

			result.addPassed(user);
		}));

		return result;
	}
}
