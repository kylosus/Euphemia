const { MessageEmbed } = require('discord.js');

module.exports = (channel, guild, user) => {
	return channel.send(new MessageEmbed()
		.setColor('GREEN')
		.setTitle('♻ User unbanned')
		.setThumbnail(user.displayAvatarURL())
		.setDescription(user.tag)
		.addField('ID', user.id, false)
	);
};
