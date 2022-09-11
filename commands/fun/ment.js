import { EmbedBuilder, Colors } from 'discord.js';
import { ECommand }             from '../../lib/index.js';

import QUOTES from './ment.js.json' assert { type: 'json' };

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['ment'],
			description: {
				content:  'Replies with a random Code Ment quote',
				usage:    '',
				examples: ['ment']
			},
			guildOnly:   false,
			ownerOnly:   false
		});
	}

	async run() {
		return QUOTES[Math.floor(Math.random() * QUOTES.length)];
	}

	async ship(message, result) {
		return message.channel.send({
			embeds: [new EmbedBuilder()
				.setColor(Math.floor(Math.random() * Colors.White))
				.setDescription(result)
			]
		});
	}
}
