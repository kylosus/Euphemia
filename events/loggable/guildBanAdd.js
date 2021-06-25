const { RichEmbed } = require('discord.js');

module.exports = (guild, user) => {
	const entry = guild.client.provider.get(guild, 'guildBanAdd', false);
	
	if (!entry || !entry.log) {
		return;
	}

	const channel = guild.channels.get(entry.log);

	if (!channel) {
		return;
	}

	channel.send(new RichEmbed()
		.setColor('BROWN')
		.setTitle('🔨 User banned')
		.setThumbnail(user.avatarURL)
		.setDescription(user.tag)
		.addField('ID', user.id, false)
	);
};
