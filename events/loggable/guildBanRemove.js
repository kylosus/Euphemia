import { MessageEmbed } from 'discord.js';

	return channel.send(new MessageEmbed()
		.setColor('GREEN')
		.setTitle('♻ User unbanned')
		.setThumbnail(user.displayAvatarURL())
		.setDescription(user.tag)
		.addField('ID', user.id, false)
	);
export default async (channel, guild, user) => {
};
