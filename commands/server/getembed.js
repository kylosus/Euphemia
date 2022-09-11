import { codeBlock, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ArgConsts, ECommand }                          from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['getembed'],
			description:     {
				content:  'Says something. Supports embeds',
				usage:    '[channel or current channel] <text>',
				examples: ['say something', 'say #general {JSON}']
			},
			userPermissions: [PermissionsBitField.Flags.ManageMessages],
			args:            [
				{
					id:       'channel',
					type:     ArgConsts.TYPE.CHANNEL,
					optional: true,
					default:  m => m.channel
				},
				{
					id:      'id',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please provide a message id.'
				}
			],
			guildOnly:       true,
			ownerOnly:       false,
		});
	}

	async run(message, { channel, id }) {
		const m = await channel.messages.fetch({ message: id });

		if (!m.embeds) {
			throw 'Message has no embeds';
		}

		return m.embeds[0].toJSON();
	}

	async ship(message, result) {
		return message.channel.send({
			embeds: [new EmbedBuilder()
				.setColor(this.client.config.COLOR_OK)
				.setDescription(codeBlock(JSON.stringify(result, null, 4)))]
		});
	}
}
