import { inlineCode, EmbedBuilder, Colors } from 'discord.js';

export default async (channel, member, moderator) => {
	return channel.send({
		embeds: [new EmbedBuilder()
			.setColor(Colors.Gold)
			.setTitle('🔈 User unmuted')
			.setThumbnail(member.user.displayAvatarURL())

			.addFields(
				{ name: 'User', value: `${member.toString()} ${inlineCode(member.id)}`, inline: false },
				{ name: 'Moderator', value: moderator.toString() }
			)
		]
	});
};
