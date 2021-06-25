const { RichEmbed } = require('discord.js');

module.exports = member => {
	const entry = member.client.provider.get(member.guild, 'guildMemberUnmuted', false);

	if (!entry || !entry.log) {
		return;
	}

	const channel = member.guild.channels.get(entry.log);

	if (!channel) {
		return;
	}
	
	channel.send(new RichEmbed()
		.setColor('GOLD')
		.setTitle('🔈 User unmuted')
		.setThumbnail(member.user.avatarURL)
		.addField('User', `${member.toString()} \`${member.id}\``, false)
	);
};
