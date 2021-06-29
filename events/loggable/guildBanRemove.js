const { MessageEmbed } = require('discord.js');

module.exports = (guild, user) => {
	const entry = guild.client.provider.get(guild, 'log', {guildBanRemove: null});
	
	if (!entry.guildBanRemove) {
		return;
	}

	const channel = guild.channels.resolve(entry.guildBanRemove);

	if (!channel) {
		return;
	}

	channel.send(new MessageEmbed()
		.setColor('GREEN')
		.setTitle('♻ User unbanned')
		.setThumbnail(user.avatarURL)
		.setDescription(user.tag)
		.addField('ID', user.id, false)
	);
};
