const { MessageEmbed } = require('discord.js');

module.exports = (member, duration, moderator) => {
	const entry = member.client.provider.get(member.guild, 'log', {guildMemberMuted: null});

	if (!entry.guildMemberMuted) {
		return;
	}

	const channel = member.guild.channels.resolve(entry.guildMemberMuted);

	if (!channel) {
		return;
	}

	return channel.send(new MessageEmbed()
		.setColor('GOLD')
		.setTitle('🔇 User muted')
		.setThumbnail(member.user.avatarURL)
		.addField('User', `${member.toString()} \`${member.id}\``, false)
		.addField('Duration', `${duration ? duration : '-'} minutes`)
		.addField('Moderator', moderator.toString())
	);
};
