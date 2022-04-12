import { MessageEmbed } from 'discord.js';
import { ECommand }     from '../../lib/index.js';
import dayjs            from 'dayjs';
import duration         from 'dayjs/plugin/duration.js';
import pjson            from '../../package.json' assert { type: 'json' };

dayjs.extend(duration);

const THUMBNAIL = 'https://cdn.discordapp.com/attachments/469111529384443904/473072301315981312/Euphie-sama.png';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['stats'],
			description: {
				content:  'Shows bot stats',
				usage:    '',
				examples: ['stats']
			},
			guildOnly:   false,
			ownerOnly:   false,
		});
	}

	async run() {
		return dayjs.duration(this.client.uptime, 'milliseconds').format('D [days] H [hours] m [minutes] s [seconds]');
	}

	async ship(message, result) {
		return message.channel.send({
			embeds:
				[new MessageEmbed()
					.setAuthor({
						name:    `Euphemia version ${pjson.version} by ${pjson.author}`,
						url:     pjson.repository.name,
						iconURL: THUMBNAIL
					})
					.setColor(this.client.defaultColor)
					.addField('⌛ Uptime', result, true)
					// .addField('📥 Received', this.client.messageStats.received, true)
					// .addField('📤 Sent', this.client.messageStats.sent, true)
					// .addField('📡 Commands', this.client.messageStats.commands, true)
					.addField('📙 Servers', String(this.client.guilds.cache.size), true)
					.addField('📑 Channels', String(this.client.channels.cache.size), true)
					.addField('📎 Users', String(this.client.users.cache.size), true)
				]
		});
	}
};
