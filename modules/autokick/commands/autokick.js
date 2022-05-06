import { MessageEmbed, Permissions } from 'discord.js';
import { ECommand }                  from '../../../lib/index.js';
import * as AutoKick                 from '../index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['autokick'],
			description:       {
				content:  'Automatically kicks every new member on join. Execute again to disable.',
				usage:    '',
				examples: ['autokick'],
			},
			userPermissions:   [Permissions.FLAGS.KICK_MEMBERS],
			clientPermissions: [Permissions.FLAGS.KICK_MEMBERS],
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
		return message.channel.send({
			embeds: [new MessageEmbed()
				.setColor('DARK_RED')
				.setTitle(result)]
		});
	}
}