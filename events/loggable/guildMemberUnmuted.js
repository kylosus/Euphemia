const {MessageEmbed} = require('discord.js');

module.exports = (channel, member, moderator) => {
	return channel.send(new MessageEmbed()
		.setColor('GOLD')
		.setTitle('🔈 User unmuted')
		.setThumbnail(member.user.avatarURL)
		.addField('User', `${member.toString()} \`${member.id}\``, false)
		.addField('Moderator', moderator.toString())
	);
};
