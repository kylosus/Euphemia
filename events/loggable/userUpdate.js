const { RichEmbed } = require('discord.js');

module.exports = (oldUser, newUser) => {
	if (oldUser.tag === newUser.tag) {
		return;
	}

	const guilds = newUser.client.guilds.cache
		.filter(g => g.members.cache.has(newUser.id));

	guilds.forEach(g => {
		const entry = g.client.provider.get(g, 'log', {userUpdate: null});

		if (!entry.userUpdate) {
			return;
		}

		const channel = g.channels.resolve(entry.userUpdate);

		if (!channel) {
			return;
		}

		return channel.send(new RichEmbed()
			.setColor('GREEN')
			.setThumbnail(newUser.displayAvatarURL())
			.setTitle('Username change')
			.setDescription(`**${oldUser.tag}** has changed their username to **${newUser.tag}**`)
			.setTimestamp((new Date()))
		);
	});

	// if (oldUser.tag !== newUser.tag) {
	// 	newUser.client.guilds
	// 		.filter(guild => guild.members.has(newUser.id))
	// 		.tap(guild => {
	// 			const entry = newUser.client.provider.get(guild, 'userUpdate', false);
	// 			if (!entry || !entry.log) {
	// 				return;
	// 			}
	//
	// 			const channel = guild.channels.get(entry.log);
	//
	// 			if (!channel) {
	// 				return;
	// 			}
	//
	// 			channel.send(new RichEmbed()
	// 				.setColor('GREEN')
	// 				.setThumbnail(newUser.avatarURL)
	// 				.setTitle('Username change')
	// 				.setDescription(`**${oldUser.tag}** has changed their username to **${newUser.tag}**`)
	// 				.setTimestamp((new Date()))
	// 			);
	// 		});
	// }
};
