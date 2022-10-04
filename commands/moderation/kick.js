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
					id:      'members',
					type:    ArgConsts.TYPE.MEMBERS,
					message: 'Please mention members to kick'
				},
				{
					id:       'reason',
					type:     ArgConsts.TYPE.REASON,
					optional: true,
					default:  () => 'No reason provided'
				},
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { members, reason }) {
		const result = new ModerationCommandResult(reason);

		await Promise.all(members.map(async m => {
			if (!m.kickable) {
				return result.addFailed(m, 'Member too high in the hierarchy');
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
