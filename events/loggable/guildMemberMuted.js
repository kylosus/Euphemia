import { inlineCode, time, TimestampStyles, EmbedBuilder, Colors } from 'discord.js';

export default async (channel, member, expires, moderator) => {
	return channel.send({
		embeds: [new EmbedBuilder()
			.setColor(Colors.Gold)
			.setTitle('🔇 User muted')
			.setThumbnail(member.user.displayAvatarURL())

			.addFields(
				{ name: 'User', value: `${member.toString()} ${inlineCode(member.id)}`, inline: false },
				{ name: 'Expires', value: `${expires ? time(expires, TimestampStyles.RelativeTime) : 'Never'}` },
				{ name: 'Moderator', value: moderator.toString() }
			)
		]
	});
};
