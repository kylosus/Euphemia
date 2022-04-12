import { Permissions }         from 'discord.js';
import { ArgConsts, ECommand } from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['cache'],
			description:       {
				content:  'Caches messages in a channel',
				usage:    'cache [channel]',
				examples: ['cache', 'cache #general']
			},
			clientPermissions: [Permissions.FLAGS.READ_MESSAGE_HISTORY],
			args:              [
				{
					id:      'channel',
					type:    ArgConsts.CHANNEL,
					default: m => m.channel
				},
			],
			guildOnly:         true,
			ownerOnly:         true,
		});
	}

	async run(message, { channel }) {
		await channel.messages.fetch({ limit: 100 });
		return '👌';
	}
}
