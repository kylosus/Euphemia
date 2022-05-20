import { MessageEmbed, Permissions } from 'discord.js';
import { ArgConsts, ECommand }       from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['sayd', 'saydelete'],
			description:       {
				content:  'Says something and deletes the command. Supports embeds',
				usage:    '[channel or current channel] <text>',
				examples: ['sayd something', 'sayd #general {JSON}']
			},
			userPermissions:   [Permissions.FLAGS.MANAGE_MESSAGES],
			clientPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
			args:              [
				{
					id:       'channel',
					type:     ArgConsts.TYPE.CHANNEL,
					optional: true,
					default:  m => m.channel
				},
				{
					id:      'text',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please provide text'
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { channel, text }) {
		await message.delete();
		return { channel, text };
	}

	async ship(message, { channel, text }) {
		try {
			const json = JSON.parse(text);
			return channel.send({ content: json.content, embeds: [new MessageEmbed(json)] });
		} catch (err) {
			return channel.send({ content: text });
		}
	}
}
