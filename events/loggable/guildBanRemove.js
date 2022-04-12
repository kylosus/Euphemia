import { MessageEmbed } from 'discord.js';

export default async (channel, guild, user) => {
	return channel.send({
		embeds: [new MessageEmbed()
			.setColor('GREEN')
			.setTitle('♻ User unbanned')
			.setThumbnail(user.displayAvatarURL())
			.setDescription(user.tag)
			.addField('ID', user.id, false)]
	});
};
