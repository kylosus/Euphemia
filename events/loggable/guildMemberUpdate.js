const {MessageEmbed} = require('discord.js');

module.exports = (oldMember, newMember) => {
	const entry = newMember.client.provider.get(newMember.guild, 'log', {guildMemberUpdate: null});

	if (!entry.guildMemberUpdate) {
		return;
	}

	const channel = newMember.guild.channels.resolve(entry.guildMemberUpdate);

	if (!channel) {
		return;
	}

	if (oldMember.nickname !== newMember.nickname) {
		// Sorry
		const body = newMember.nickname ? `**${newMember.user.tag}** has changed their nickname` + (oldMember.nickname ? ` from **${oldMember.nickname}**` : '') + ` to **${newMember.nickname}**`
			: `**${newMember.user.tag}** has removed their nickname, **${oldMember.nickname}**`;

		return channel.send(new MessageEmbed()
			.setColor('GREEN')
			.setThumbnail(newMember.user.avatarURL)
			.setTitle('Nickname change')
			.setDescription(body)
			.setTimestamp()
		);
	}

	if (oldMember.user.tag !== newMember.user.tag) {
		return channel.send(new MessageEmbed()
			.setColor('GREEN')
			.setThumbnail(newMember.user.avatarURL)
			.setTitle('Username change')
			.setDescription(`**${oldMember.user.tag}** has changed their username to **${newMember.user.tag}**`)
			.setTimestamp()
		);
	}
};
