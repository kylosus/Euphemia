const {MessageEmbed} = require('discord.js');

module.exports = (channel, guild, user) => {
	return channel.send(new MessageEmbed()
		.setColor('BROWN')
		.setTitle('🔨 User banned')
		.setThumbnail(user.avatarURL)
		.setDescription(user.tag)
		.addField('ID', user.id, false)
	);
};
