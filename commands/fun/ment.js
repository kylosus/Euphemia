const { MessageEmbed } = require('discord.js');
const { ECommand }     = require('../../lib');
const QUOTES           = require('./ment.js.json');

module.exports = class extends ECommand {
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
		return message.channel.send(new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(result)
		);
	}
};
