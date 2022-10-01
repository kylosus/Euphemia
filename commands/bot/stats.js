import { EmbedBuilder } from 'discord.js';
import { ECommand }     from '../../lib/index.js';
import dayjs            from 'dayjs';
import duration         from 'dayjs/plugin/duration.js';
import pjson            from '../../package.json' assert { type: 'json' };

dayjs.extend(duration);

const THUMBNAIL = 'https://cdn.discordapp.com/attachments/469111529384443904/473072301315981312/Euphie-sama.png';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['stats', 'status'],
			description: {
				content:  'Shows bot stats',
				usage:    '',
				examples: ['stats']
			},
			guildOnly:   false,
			ownerOnly:   false,
			slash:       true
		});
	}

	async run() {
		return dayjs.duration(this.client.uptime, 'milliseconds').format('D [days] H [hours] m [minutes] s [seconds]');
	}

	async ship(message, result) {
		return message.reply({
			embeds:
				[new EmbedBuilder()
					.setAuthor({
						name:    `Euphemia version ${pjson.version} by ${pjson.author}`,
						url:     pjson.repository.name,
						iconURL: THUMBNAIL
					})
					.setColor(this.client.config.COLOR_OK)
					.addFields(
						{ name: '⌛ Uptime', value: result, inline: true },
						{ name: '📙 Servers', value: String(this.client.guilds.cache.size), inline: true },
						{ name: '📑 Channels', value: String(this.client.channels.cache.size), inline: true },
						{ name: '📎 Users', value: String(this.client.users.cache.size), inline: true },
					)
				]
		});
	}
};
