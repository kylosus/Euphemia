import { Formatters, MessageEmbed } from 'discord.js';

export default async (channel, member, expires, moderator) => {
	return channel.send({
		embeds: [new MessageEmbed()
			.setColor('GOLD')
			.setTitle('🔇 User muted')
			.setThumbnail(member.user.displayAvatarURL())
			.addField('User', `${member} ${Formatters.inlineCode(member.id)}`, false)
			.addField('Expires', `${expires ? Formatters.time(expires, Formatters.TimestampStyles.RelativeTime) : 'Never'}`)
			.addField('Moderator', moderator.toString())]
	});
};
