import { MessageEmbed } from 'discord.js';

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
			embeds: [new MessageEmbed()
				.setColor('GREEN')
				.setThumbnail(newUser.displayAvatarURL())
				.setTitle('Username change')
				.setDescription(`**${oldUser.tag}** has changed their username to **${newUser.tag}**`)
				.setTimestamp()]
		});
	}));
};
