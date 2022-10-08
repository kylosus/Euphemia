import { PermissionsBitField }                        from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'kick',
			aliases:           ['kick'],
			description:       {
				content:  'Kicks a member.',
				usage:    '<member> [member2...] [reason]',
				examples: ['kick @member', 'kick @member1 @member2', 'kick 275331662865367040'],
			},
			userPermissions:   [PermissionsBitField.Flags.KickMembers],
			clientPermissions: [PermissionsBitField.Flags.KickMembers],
			args:              [
				{
					id:          'members',
					type:        ArgConsts.TYPE.MEMBERS,
					description: 'Member to kick',
					message:     'Please mention members to kick'
				},
				{
					id:          'reason',
					type:        ArgConsts.TYPE.REASON,
					description: 'Reason for the kick',
					optional:    true,
					defaultFunc: () => 'No reason provided'
				},
			],
			guildOnly:         true,
			ownerOnly:         false,
			slash:             true
		});
	}

	async run(message, { members, reason }) {
		const result = new ModerationCommandResult(reason);

		await Promise.all(members.map(async m => {
			if (!m.kickable) {
				return result.addFailed(m, 'Missing client permissions');
			}

			if (m.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
				return result.addFailed(m, 'Missing user permissions');
			}

			try {
				await m.kick(reason);
			} catch (err) {
				return result.addFailed(m, err.message);
			}

			result.addPassed(m);
		}));

		return result;
	}
}
