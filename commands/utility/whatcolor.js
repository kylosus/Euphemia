import { MessageEmbed }        from 'discord.js';
import { ArgConsts, ECommand } from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['color', 'whatcolor'],
			description: {
				content:  'Shows color',
				usage:    '<color>',
				examples: ['whatcolor #ee90ea']
			},
			args:        [
				{
					id:      'color',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please provide color'
				}
			],
			guildOnly:   false,
			ownerOnly:   false
		});
	}

	async run(message, { color }) {
		return color;
	}

	async ship(message, result) {
		return message.channel.send(new MessageEmbed()
			.setTitle('This color')
			.setColor(result)
		);
	}
}
