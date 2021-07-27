const { MessageEmbed } = require('discord.js');
const { ECommand }     = require('../../lib');
const QUOTES           = require('./jojo.js.json');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['jojo', 'duwang', 'nani'],
			description: {
				content:  'Replies with a random JoJo quote',
				usage:    '',
				examples: ['jojo']
			},
			guildOnly:   false,
			ownerOnly:   false
		});
	}

	async run() {
		return QUOTES[Math.floor(Math.random() * QUOTES.length)];
	}

	async ship(message, result) {
		return message.channel.send(new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(result)
		);
	}
};
