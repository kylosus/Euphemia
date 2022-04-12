import { MessageEmbed } from 'discord.js';

export default async (channel, guild, user) => {
	return channel.send({
		embeds: [new MessageEmbed()
			.setColor('DARK_RED')
			.setTitle('🔨 User banned')
			.setThumbnail(user.displayAvatarURL())
			.setDescription(user.tag)
			.addField('ID', user.id, false)]
	});
};
