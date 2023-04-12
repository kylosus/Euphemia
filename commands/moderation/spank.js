import { PermissionsBitField } from 'discord.js';
import { ArgConsts, ECommand } from '../../lib/index.js';
import { EmbedError }          from '../../lib/Error/index.js';

const SPANK_CHANCE = 0.1;
const SPANK_MILLISECONDS = 60000;

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['spank'],
			description:       {
				content:  'Spanks bad people',
				usage:    '<member1> [member2 ...]',
				examples: ['spank @Person1']
			},
			clientPermissions: [PermissionsBitField.Flags.ModerateMembers],
			args:              [
				{
					id:          'member',
					type:        ArgConsts.TYPE.MEMBER,
					description: 'The baddie to spank',
					message:     'Are you trying to spank thin air?',
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
			slash:             true
		});
	}

	async run(message, { member }) {
		if (message.member.id === member.id) {
			throw new EmbedError('Are you trying to spank yourself?');
		}

		// Higher than bot
		if (!member?.moderatable) {
			throw new EmbedError(`${member} is too powerful to spank!`);
		}

		// No perms
		if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
			// Won the roulette
			if (Math.random() < SPANK_CHANCE) {
				await timeout(member);
				return 'Nice try. You got yourself spa- Wait What? It went through?';
			}

			await timeout(message.member);

			return 'Nice try. You got yourself spanked';
		}

		// Spank the actual member
		await timeout(message.member);

		return `${member.toString()} has been spanked by ${message.member}`;
	}
}

async function timeout(member) {
	return member.timeout(SPANK_MILLISECONDS, 'Spanked').catch(() => {});
}
