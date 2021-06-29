const { MessageEmbed } = require('discord.js');

const ECommand = require('../../lib/ECommand');

const moment = require('moment');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['ping'],
			description: {
				content: 'Replies with ping',
				usage: '',
				examples: ['ping']
			},
			args: [],
			guildOnly: false,
			nsfw: false,
			ownerOnly: false,
		});
	}

	async run(message) {
		return moment().diff(moment(message.createdAt));
	}

	async ship(message, result) {
		return message.channel.send(new MessageEmbed()
			.setDescription(`⏳ ${result}`)
			.setColor(message.member?.displayColor ?? 'WHITE')
		);
	}
};
