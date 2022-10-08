import { PermissionsBitField } from 'discord.js';
import { ArgConsts, ECommand } from '../../lib/index.js';
import { EmbedError }          from '../../lib/Error/index.js';

// 2 seconds
const MAX_MESSAGES = 100;
const DELETE_AFTER = 2000;

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['purge', 'p'],
			description:       {
				content:  'Purges messages in the channel.',
				usage:    '[amount]',
				examples: ['purge', 'purge 100'],
			},
			userPermissions:   [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.ReadMessageHistory],
			clientPermissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.ReadMessageHistory],
			args:              [{
				id: 'amount', type: ArgConsts.TYPE.NUMBER, optional: true, default: () => 1,
			}],
			guildOnly:         true,
			ownerOnly:         false,
			deleteAfter:       DELETE_AFTER
		});
	}

	async run(message, { amount }) {
		// Bad fix?e
		const permissions = message.member.permissionsIn(message.channel);
		if (!permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			throw new EmbedError('You cannot purge messages in this channel');
		}

		if (amount > MAX_MESSAGES) {
			amount = MAX_MESSAGES;
		}

		await message.delete();

		const deleted = (await message.channel.bulkDelete(amount)).size;
		return `Purged ${deleted} message${deleted > 1 ? 's' : ''}`;
	}
}
