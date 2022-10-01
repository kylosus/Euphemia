import { PermissionsBitField } from 'discord.js';
import { ArgConsts, ECommand } from '../../lib/index.js';
import { resolveMessageArg }   from './util.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['say'],
			description:     {
				content:  'Says something. Supports embeds',
				usage:    '[channel or current channel] <text>',
				examples: ['say something', 'say #general {JSON}']
			},
			userPermissions: [PermissionsBitField.Flags.ManageMessages],
			args:            [
				{
					id:          'channel',
					type:        ArgConsts.TYPE.CHANNEL,
					description: 'The channel to send the message in',
					optional:    true,
					defaultFunc: m => m.channel
				},
				{
					id:          'text',
					type:        ArgConsts.TYPE.TEXT,
					description: 'The text to send',
					message:     'Please provide text'
				}
			],
			guildOnly:       true,
			ownerOnly:       false,
			slash:           true,
			ephemeral:       true
		});
	}

	async run(message, { channel, text }) {
		await channel.send(resolveMessageArg(text));
	}
}
