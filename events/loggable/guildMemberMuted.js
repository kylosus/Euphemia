import { Formatters, MessageEmbed } from 'discord.js';

	return channel.send(new MessageEmbed()
		.setColor('GOLD')
		.setTitle('🔇 User muted')
		.setThumbnail(member.user.displayAvatarURL())
		.addField('User', `${member} \`${member.id}\``, false)
		.addField('Expires', `${expires ? moment(expires).fromNow() : 'Never'}`)
		.addField('Moderator', moderator)
	);
export default async (channel, member, expires, moderator) => {
};
