const { MessageEmbed } = require('discord.js');

module.exports.ErrorEmbed = m => {
	return new MessageEmbed()
		.setColor('RED')
		.setTitle(m);
};
