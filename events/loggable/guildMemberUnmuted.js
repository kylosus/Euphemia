import { Formatters, MessageEmbed } from 'discord.js';

module.exports = async (channel, member, moderator) => {
	return channel.send(new MessageEmbed()
		.setColor('GOLD')
		.setTitle('🔈 User unmuted')
		.setThumbnail(member.user.displayAvatarURL())
		.addField('User', `${member} \`${member.id}\``, false)
		.addField('Moderator', moderator)
	);
export default async (channel, member, moderator) => {
};
