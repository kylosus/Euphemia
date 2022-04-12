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
					id:      'ids',
					type:    ArgConsts.IDS,
					message: 'Please mention users to ban'
				},
				{
					id:       'reason',
					type:     ArgConsts.REASON,
					optional: true,
					default:  () => null,
				},
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { ids, reason }) {
		const result = new ModerationCommandResult(reason);

		await Promise.all(ids.map(async id => {
			const member = await message.guild.members.fetch(id);

			if (member && !member.bannable) {
				return result.addFailed(id, 'Member too high in the hierarchy');
			}

			try {
				await message.guild.members.ban(id, {
					days: 0,
					reason
				});
			} catch (err) {
				return result.addFailed(id, err.message);
			}

			result.addPassed(id);
		}));

		return result;
	}
}
