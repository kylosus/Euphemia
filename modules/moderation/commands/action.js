import { Formatters, MessageEmbed, Permissions } from 'discord.js';
import { ArgConsts, ECommand }                   from '../../../lib/index.js';
import { getAction }                 from '../db.js';
import moment                        from 'moment';

const COLOR = '#2CDDD7';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['action'],
			description:     {
				content:  'Shows details of a specified action',
				usage:    '<action number>',
				examples: ['action 1']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args:            [
				{
					id:      'number',
					type:    ArgConsts.NUMBER,
					message: 'Please specify an action number'
				}
			],
			guildOnly:       true,
			nsfw:            false,
			ownerOnly:       false,
		});
	}

	async run(message, { number }) {
		const result = await db.getAction(message.guild.id, number);

		if (!result) {
			throw 'Action number not found';
		}

		return result;
	}

	async ship(message, result) {
		const embed = new MessageEmbed()
			.setColor(COLOR);

		embed.setAuthor(...(user => {
			if (user) {
				return [`${user.tag} (${result.moderator})}`, user.displayAvatarURL()];
			}

			return [`Unknown user: ${result.moderator}`];
		})(await this.client.users.fetch(result.moderator).catch(() => {})));

		const prefix = result.passed ? '✅' : '❌';	// Fix those later
		embed.setDescription(`${prefix} Action \`[${result.id}]\` ${result.action.toLowerCase()} -> <@${result.target}>`);
		embed.addField('Reason', '```' + (result.reason || 'No reason provided') + '```');

		if (!result.passed) {
			embed.addField('Failed', '```' + (result.failedReason || 'Unknown reason') + '```');
		}

		if (result.action === 'MUTE') {
			embed.addField('Muted for', (time => {
				if (!time) {
					return 'Forever';
				}

				const diff = moment.duration(moment(time).diff(result.timestamp));
				return `${diff.days()} days, ${diff.hours()} hours, ${diff.minutes()} minutes`;
			})(result.aux));
		}

		embed.setTimestamp(result.timestamp);

		return message.channel.send(embed);
	}
}
