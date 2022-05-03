import { Formatters, MessageEmbed } from 'discord.js';

const COLOR = '#2CDDD7';

export default async (channel, guild, moderator, result) => {
	const embed = new MessageEmbed()
		.setColor(COLOR);

	embed.setAuthor({
		name:    `[${result.id}] ${moderator.user.tag} (${result.moderator.id})`,
		iconURL: moderator.user.displayAvatarURL()
	});

	const prefix = result.passed ? '✅' : '❌';	// Fix those later
	embed.setDescription(`${prefix} Action ${result.action} -> ${result.target.toString()}`);
	embed.addField('Reason', Formatters.codeBlock(result.reason || 'No reason provided'));

	if (!result.passed) {
		embed.addField('Failed', Formatters.codeBlock((result.failedReason || 'Unknown reason')));
	}

	if (result.action === 'MUTE' || result.action === 'TIMEOUT') {
		if (result.aux) {
			embed.addField('Expires', Formatters.time(new Date(result.aux), Formatters.TimestampStyles.RelativeTime));
		}
	}

	embed.setTimestamp(result.timestamp);

	return channel.send({ embeds: [embed] });
};
