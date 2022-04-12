import { MessageEmbed } from 'discord.js';

	return channel.send(new MessageEmbed()
		.setColor('BROWN')
		.setTitle('🔨 User banned')
		.setThumbnail(user.displayAvatarURL())
		.setDescription(user.tag)
		.addField('ID', user.id, false)
	);
export default async (channel, guild, user) => {
};
