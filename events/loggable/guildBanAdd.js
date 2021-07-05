const {MessageEmbed} = require('discord.js');

module.exports = (guild, user) => {
	const entry = guild.client.provider.get(guild, 'log', {guildBanAdd: null});

	if (!entry.guildBanAdd) {
		return;
	}

	const channel = guild.channels.cache.get(entry.guildBanAdd);

	if (!channel) {
		return;
	}

	return channel.send(new MessageEmbed()
		.setColor('BROWN')
		.setTitle('🔨 User banned')
		.setThumbnail(user.avatarURL)
		.setDescription(user.tag)
		.addField('ID', user.id, false)
	);
};
