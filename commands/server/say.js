import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ArgConsts, ECommand }               from '../../lib/index.js';

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
			slash:           true
		});
	}

	async run(message, { channel, text }) {
		return { channel, text };
	}

	async ship(message, { channel, text }) {
		try {
			const json = JSON.parse(text);
			return channel.send({ content: json.content, embeds: [new EmbedBuilder(json)] });
		} catch (err) {
			return channel.send({ content: text });
		}
	}
}
