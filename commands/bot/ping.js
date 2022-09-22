import { EmbedBuilder } from 'discord.js';
import { ECommand }     from '../../lib/index.js';
import dayjs            from 'dayjs';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['ping'],
			description: {
				content:  'Replies with ping',
				usage:    '',
				examples: ['ping']
			},
			guildOnly:   false,
			ownerOnly:   false,
			slash:       true
		});
	}

	async run(message) {
		return dayjs().diff(dayjs(message.createdAt));
	}

	async ship(message, result) {
		return message.channel.send({
			embeds: [new EmbedBuilder()
				.setDescription(`⏳ ${result}`)
				.setColor(message.member?.displayColor ?? 'WHITE')
			]
		});
	}
}
