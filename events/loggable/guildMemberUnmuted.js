const {MessageEmbed} = require('discord.js');

module.exports = (member, moderator) => {
	const entry = member.client.provider.get(member.guild, 'log', {guildMemberUnmuted: null});

	if (!entry.guildMemberUnmuted) {
		return;
	}

	const channel = member.guild.channels.cache.get(entry.guildMemberUnmuted);

	if (!channel) {
		return;
	}

	channel.send(new MessageEmbed()
		.setColor('GOLD')
		.setTitle('🔈 User unmuted')
		.setThumbnail(member.user.avatarURL)
		.addField('User', `${member.toString()} \`${member.id}\``, false)
		.addField('Moderator', moderator.toString())
	);
};
