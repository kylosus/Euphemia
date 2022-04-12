import { MessageEmbed } from 'discord.js';
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
		});
	}

	async run(message) {
		return moment().diff(moment(message.createdAt));
	}

	async ship(message, result) {
		return message.channel.send({
			embeds: [new MessageEmbed()
				.setDescription(`⏳ ${result}`)
				.setColor(message.member?.displayColor ?? 'WHITE')
			]
		});
	}
}
