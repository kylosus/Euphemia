const { RichEmbed } = require('discord.js');

module.exports = (oldMember, newMember, Client) => {
	const entry = Client.provider.get(newMember.guild, 'guildMemberUpdate', false);
	
	if (!entry || !entry.log) {
		return;
	}

	const channel = newMember.guild.channels.get(entry.log);

	if (!channel) {
		return;
	}

	if (oldMember.nickname !== newMember.nickname) {
		// Sorry
		const body = newMember.nickname ? `**${newMember.user.tag}** has changed their nickname` + (oldMember.nickname? ` from **${oldMember.nickname}**` : '') + ` to **${newMember.nickname}**`
			: `**${newMember.user.tag}** has removed their nickname, **${oldMember.nickname}**`;

		channel.send(new RichEmbed()
			.setColor('GREEN')
			.setThumbnail(newMember.user.avatarURL)
			.setTitle('Nickname change')
			.setDescription(body)
			.setTimestamp((new Date()))
		);
	}

	if (oldMember.user.tag !== newMember.user.tag) {
		channel.send(new RichEmbed()
			.setColor('GREEN')
			.setThumbnail(newMember.user.avatarURL)
			.setTitle('Username change')
			.setDescription(`**${oldMember.user.tag}** has changed their username to **${newMember.user.tag}**`)
			.setTimestamp((new Date()))
		);
	}
};
