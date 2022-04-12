import { Permissions }                                from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';
import { getMutedRole, unmuteMember }                 from '../../modules/mute/index.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'unmute',
			aliases:           ['unmute'],
			description:       {
				content:  'Unmutes mentioned users',
				usage:    '<member1> [member2 ...]',
				examples: ['unmute @Person1', 'unmute @Person1 @Person2']
			},
			userPermissions:   [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_GUILD],
			args:              [
				{
					id:      'members',
					type:    ArgConsts.MEMBERS,
					message: 'Please mention members to unmute'
				},
				{
					id:       'reason',
					type:     ArgConsts.REASON,
					optional: true,
					default:  () => null
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { members, reason }) {
		const result = new ModerationCommandResult(reason);

		const role = await mutedRole.getMutedRole(message.guild);

		if (!role) {
			throw 'Muted role not found';
		}

		await Promise.all(members.map(async m => {
			// Look up other roles that remove message send permissions
			if (!role.members.has(m.id)) {
				return result.addFailed(m, 'Not muted');
			}

			try {
				await muteHandler.unmuteMember(message.guild, m, role, reason);
			} catch (error) {
				return result.addFailed(m, error.message);
			}

			result.addPassed(m);
		}));

		return result;
	}
}
