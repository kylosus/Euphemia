import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ECommand }                          from '../../../lib/index.js';
import * as AutoKick                         from '../index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['autokick'],
			description:       {
				content:  'Automatically kicks every new member on join. Execute again to disable.',
				usage:    '',
				examples: ['autokick'],
			},
			userPermissions:   [PermissionsBitField.Flags.KickMembers],
			clientPermissions: [PermissionsBitField.Flags.KickMembers],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message) {
		const state = AutoKick.getState(message.guild);
		AutoKick.setState(message.guild, !state);

		return `${state ? 'Disabled' : 'Enabled'} autokick on new member join`;
	}

	async ship(message, result) {
		return message.reply({
			embeds: [new EmbedBuilder()
				.setColor(this.client.config.COLOR_SPECIAL)
				.setTitle(result)]
		});
	}
}