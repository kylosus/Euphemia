const { MessageEmbed }        = require('discord.js');
const { ArgConsts, ECommand } = require('../../lib');

module.exports = class extends ECommand {
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
					type:    ArgConsts.TEXT,
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
};
