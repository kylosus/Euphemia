import { codeBlock, time, TimestampStyles, EmbedBuilder } from 'discord.js';

const COLOR = '#2CDDD7';

export default async (channel, guild, moderator, result) => {
	const embed = new EmbedBuilder()
		.setColor(COLOR);

	embed.setAuthor({
		name:    `[${result.id}] ${moderator.user.tag} (${result.moderator.id})`,
		iconURL: moderator.user.displayAvatarURL()
	});

	const prefix = result.passed ? '✅' : '❌';	// Fix those later
	embed.setDescription(`${prefix} Action ${result.action} -> ${result.target.toString()}`);
	embed.addFields({ name: 'Reason', value: codeBlock(result.reason || 'No reason provided') });

	if (!result.passed) {
		embed.addFields({ name: 'Failed', value: codeBlock((result.failedReason || 'Unknown reason')) });
	}

	if (result.action === 'MUTE' || result.action === 'TIMEOUT') {
		if (result.aux) {
			embed.addFields({ name: 'Duration', value: `${result.duration} (expires ${time(new Date(result.aux), TimestampStyles.RelativeTime)})` });
		}
	}

	embed.setTimestamp(result.timestamp);

	return channel.send({ embeds: [embed] });
};
