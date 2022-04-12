import { Permissions }                   from 'discord.js';
import { ArgConsts, ECommand }           from '../../lib/index.js';
import { getOrSetMutedRole, muteMember } from '../../modules/mute/index.js';
import dayjs                             from 'dayjs';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['spank'],
			description:       {
				content:  'Spanks bad people',
				usage:    '<member1> [member2 ...]',
				examples: ['spank @Person1', 'spank @Person1 @Person2']
			},
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_GUILD],
			args:              [
				{
					id:      'member',
					type:    ArgConsts.TYPE.MEMBER,
					message: 'Are you trying to spank thin air?',
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { member }) {
		if (message.member.id === member.id) {
			throw 'Are you trying to spank yourself?';
		}

		const toMute = (() => {
			if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
				return message.member;
			}

			return member;
		})();

		const role = await getOrSetMutedRole(message.guild);

		await toMute.roles.add(role, 'Spanked');

		const duration = dayjs().add(1, 'minutes').toISOString();
		await muteMember(message.guild, toMute, role, 'Spanked', duration);

		if (message.member.id === toMute.id) {
			return 'Nice try. You got yourself spanked';
		}

		return `${member} has been spanked by ${message.member}`;
	}
}
