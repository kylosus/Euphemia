import { EmbedBuilder, Colors } from 'discord.js';

export default async (channel, { user }) => {
	return channel.send({
		embeds: [new EmbedBuilder()
			.setColor(Colors.Green)
			.setTitle('♻ User unbanned')
			.setThumbnail(user.displayAvatarURL())
			.setDescription(user.tag)
			.addFields({ name: 'ID', value: user.id, inline: false })]
	});
};
