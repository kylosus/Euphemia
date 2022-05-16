import { MessageEmbed } from 'discord.js';

export default async (channel, { user }) => {
	return channel.send({
		embeds: [new MessageEmbed()
			.setColor(this.client.config.COLOR_OK)
			.setTitle('♻ User unbanned')
			.setThumbnail(user.displayAvatarURL())
			.setDescription(user.tag)
			.addField('ID', user.id, false)]
	});
};
