import { Formatters, MessageEmbed } from 'discord.js';

export default async (channel, member, moderator) => {
	return channel.send({
		embeds: [new MessageEmbed()
			.setColor('GOLD')
			.setTitle('🔈 User unmuted')
			.setThumbnail(member.user.displayAvatarURL())
			.addField('User', `${member.toString()} ${Formatters.inlineCode(member.id)}`, false)
			.addField('Moderator', moderator.toString())]
	});
};
