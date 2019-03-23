const { RichEmbed } = require('discord.js');

module.exports = (member, duration, moderator) => {
	const entry = member.client.provider.get(member.guild, 'guildMemberMuted', false);

	if (!entry || !entry.log) {
		return;
	}

	const channel = member.guild.channels.get(entry.log);
	
	if (!channel) {
		return;
	}

	channel.send(new RichEmbed()
		.setColor('GOLD')
		.setTitle('🔇 User muted')
		.setThumbnail(member.user.avatarURL)
		.addField('User', `${member.toString()} \`${member.id}\``, false)
		.addField('Duration', `${duration ? duration : '-'} minutes`)
		.addField('Moderator', moderator.toString())
	);
};

// TODO: add mod
