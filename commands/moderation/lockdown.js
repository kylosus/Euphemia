import { MessageEmbed, Permissions } from 'discord.js';
import { ECommand }                  from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['lockdown', 'ld'],
			description:       {
				content:  'Automatically mutes every new member on join.',
				usage:    '',
				examples: ['lockdown'],
			},
			userPermissions:   [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message) {
		const entry = message.client.provider.get(message.guild, 'lockdown', false);
		await message.client.provider.set(message.guild, 'lockdown', !entry);

		return `${ entry ? 'Disabled' : 'Enabled' } automute on new member join.`;
	}

	async ship(message, result) {
		return message.channel.send(new MessageEmbed()
			.setColor('DARK_RED')
			.setTitle(result)
		);
	}
}