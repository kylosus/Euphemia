const { MessageEmbed } = require('discord.js');

module.exports = (channel, guild, user) => {
	return channel.send(new MessageEmbed()
		.setColor('BROWN')
		.setTitle('🔨 User banned')
		.setThumbnail(user.displayAvatarURL())
		.setDescription(user.tag)
		.addField('ID', user.id, false)
	);
};
