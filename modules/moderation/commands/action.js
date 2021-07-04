const moment = require('moment');

const {MessageEmbed, Permissions} = require('discord.js');
const {ArgConsts, ECommand} = require('../../../lib');

const db = require('../db');

const COLOR = '#2CDDD7';

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['action'],
			description: {
				content: 'Shows details of a specified action',
				usage: '<action number>',
				examples: ['action 1']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args: [
				{
					id: 'number',
					type: ArgConsts.NUMBER,
					message: 'Please specify an action number'
				}
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
		});
	}

	async run(message, {number}) {
		const result = await db.getAction(message.guild.id, number);

		if (!result) {
			throw 'Action number not found';
		}

		return result;
	}

	async ship(message, result) {
		const embed = new MessageEmbed()
			.setColor(COLOR);

		const user = await this.client.users.fetch(result.moderator);

		if (user) {
			embed.setAuthor(`${user.tag} (${result.moderator})}`, user.displayAvatarURL());
		} else {
			embed.setAuthor('```' + result.moderator + '```');
		}

		const prefix = result.passed ? '✅' : '❌';	// Fix those later
		embed.setDescription(`${prefix} Action [${result.id}] ${result.action} -> <@${result.target}>`);
		embed.addField('Reason', '```' + (result.reason || 'No reason provided') + '```');

		if (!result.passed) {
			embed.addField('Failed', '```' + (result.failedReason || 'Unknown reason') + '```');
		}

		if (result.action === 'MUTE') {
			const diff = moment.duration(moment(result.aux).diff(result.timestamp));

			embed.addField('Muted for', `${diff.days()} days, ${diff.hours()} hours, ${diff.minutes()} minutes`);
		}

		embed.setTimestamp(result.timestamp);

		return message.channel.send(embed);
	}
};
