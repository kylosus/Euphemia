import { EmbedBuilder, Colors } from 'discord.js';
import { ECommand }             from '../../lib/index.js';

import QUOTES from './jojo.js.json' assert { type: 'json' };

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['jojo', 'duwang', 'nani'],
			description: {
				content:  'Replies with a random JoJo quote',
				usage:    '',
				examples: ['jojo']
			},
			guildOnly:   false,
			ownerOnly:   false,
			slash:       true
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
