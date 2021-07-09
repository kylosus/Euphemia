const { MessageEmbed } = require('discord.js');
const moment           = require('moment');

const COLOR = '#2CDDD7';

module.exports = (channel, guild, moderator, result) => {
	const embed = new MessageEmbed()
		.setColor(COLOR);

	embed.setAuthor(`${moderator.user.tag} (${result.moderator})}`, moderator.user.displayAvatarURL());

	const prefix = result.passed ? '✅' : '❌';	// Fix those later
	embed.setDescription(`${prefix} Action ${result.action} -> <@${result.target}>`);
	embed.addField('Reason', '```' + (result.reason || 'No reason provided') + '```');

	if (!result.passed) {
		embed.addField('Failed', '```' + (result.failedReason || 'Unknown reason') + '```');
	}

	if (result.action === 'MUTE') {
		embed.addField('Muted for', (time => {
			if (!time) {
				return 'Forever';
			}

			const diff = moment.duration(moment(result.aux).diff(result.timestamp));
			return `${diff.days()} days, ${diff.hours()} hours, ${diff.minutes()} minutes`;
		})(result.aux));
	}

	embed.setTimestamp(result.timestamp);

	return channel.send(embed);
};
