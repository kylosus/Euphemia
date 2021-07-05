const {MessageEmbed}	= require('discord.js');
const {ECommand}		= require('../../lib');
const moment			= require('moment'); require('moment-duration-format');
const pjson				= require('../../package.json');

const THUMBNAIL			= 'https://cdn.discordapp.com/attachments/469111529384443904/473072301315981312/Euphie-sama.png';

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['stats'],
			description: {
				content: 'Shows bot stats',
				usage: '',
				examples: ['stats']
			},
			guildOnly: false,
			ownerOnly: false,
		});
	}

	async run() {
		return moment.duration(this.client.uptime, 'milliseconds').format('D [days] H [hours] m [minutes] s [seconds]');
	}

	async ship(message, result) {
		return message.channel.send(new MessageEmbed()
			.setAuthor(`Euphemia version ${pjson.version} by ${pjson.author}`, THUMBNAIL, pjson.repository.name)
			.setColor(this.client.defaultColor)
			.addField('⌛ Uptime', result, true)
			// .addField('📥 Received', this.client.messageStats.received, true)
			// .addField('📤 Sent', this.client.messageStats.sent, true)
			// .addField('📡 Commands', this.client.messageStats.commands, true)
			.addField('📙 Servers', this.client.guilds.cache.size, true)
			.addField('📑 Channels', this.client.channels.cache.size, true)
			.addField('📎 Users', this.client.users.cache.size, true)
		);
	}
};
