import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ECommand }                          from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['lockdown', 'ld', 'automute'],
			description:       {
				content:  'Automatically mutes every new member on join.',
				usage:    '',
				examples: ['lockdown'],
			},
			userPermissions:   [PermissionsBitField.Flags.ManageRoles],
			clientPermissions: [PermissionsBitField.Flags.ManageRoles],
			guildOnly:         true,
			ownerOnly:         false,
			slash:             true
		});
	}

	async run(message) {
		const entry = message.client.provider.get(message.guild, 'lockdown', false);
		await message.client.provider.set(message.guild, 'lockdown', !entry);

		return `${entry ? 'Disabled' : 'Enabled'} automute on new member join.`;
	}

	async ship(message, result) {
		return message.channel.send({
			embeds: [new EmbedBuilder()
				.setColor(this.client.config.COLOR_SPECIAL)
				.setTitle(result)]
		});
	}
}