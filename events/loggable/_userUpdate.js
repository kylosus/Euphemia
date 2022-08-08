import { inlineCode, EmbedBuilder, Colors } from 'discord.js';

export default async (oldUser, newUser) => {
	if (oldUser.tag === newUser.tag) {
		return;
	}

	const guilds = newUser.client.guilds.cache
		.filter(g => g.members.cache.has(newUser.id));

	return Promise.all(guilds.map(async g => {
		const entry = g.client.provider.get(g, 'log', { userUpdate: null });

		if (!entry.userUpdate) {
			return;
		}

		const channel = g.channels.cache.get(entry.userUpdate);

		if (!channel) {
			return;
		}

		return channel.send({
			embeds: [new EmbedBuilder()
				.setColor(Colors.Green)
				.setTitle('Username change')
				.setThumbnail(newUser.displayAvatarURL())
				.setDescription(`${newUser.toString()}  ${inlineCode(newUser.tag)}`)
				.addFields(
					{ name: 'Old username', value: oldUser.tag, inline: true },
					{ name: 'New username', value: oldUser.tag, inline: true }
				)
				.setTimestamp()]
		});
	}));
};
