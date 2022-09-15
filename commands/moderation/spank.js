import { PermissionsBitField }           from 'discord.js';
import { ArgConsts, ECommand }           from '../../lib/index.js';
import { getOrSetMutedRole, muteMember } from '../../modules/mute/index.js';
import dayjs                             from 'dayjs';

const SPANK_MILLISECONDS = 60000;

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:                   ['spank'],
			description:               {
				content:  'Spanks bad people',
				usage:    '<member1> [member2 ...]',
				examples: ['spank @Person1', 'spank @Person1 @Person2']
			},
			clientPermissions: [PermissionsBitField.Flags.UseVAD],
			args:                      [
				{
					id:      'member',
					type:    ArgConsts.TYPE.MEMBER,
					message: 'Are you trying to spank thin air?',
				}
			],
			guildOnly:                 true,
			ownerOnly:                 false,
		});
	}

	async run(message, { member }) {
		if (message.member.id === member.id) {
			throw 'Are you trying to spank yourself?';
		}

		const toMute = (() => {
			if (!message.member.permissions.has(PermissionsBitField.Flags.UseVAD)) {
				return message.member;
			}

			return member;
		})();

		await toMute.timeout(SPANK_MILLISECONDS, 'Spanked');

		if (message.member.id === toMute.id) {
			return 'Nice try. You got yourself spanked';
		}

		return `${member.toString()} has been spanked by ${message.member}`;
	}
}
