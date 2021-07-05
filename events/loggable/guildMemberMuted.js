const {MessageEmbed}	= require('discord.js');
const moment			= require('moment');

module.exports = (member, expires, moderator) => {
	const {guildMemberMuted: channelID} = member.client.provider.get(member.guild, 'log', {guildMemberMuted: null});

	if (!channelID) {
		return;
	}

	const channel = member.guild.channels.cache.get(channelID);

	if (!channel) {
		return;
	}

	return channel.send(new MessageEmbed()
		.setColor('GOLD')
		.setTitle('🔇 User muted')
		.setThumbnail(member.user.avatarURL)
		.addField('User', `${member.toString()} \`${member.id}\``, false)
		.addField('Expires', `${expires ? moment(expires).fromNow() : 'Never'}`)
		.addField('Moderator', moderator.toString())
	);
};
