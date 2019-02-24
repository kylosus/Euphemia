const { RichEmbed } = require('discord.js');

const LEVELED_ROLES = [
		"538665094784221196", "538665126837092385",
		"538665163210096641", "538665192016576520",
		"538665220445437973", "538665258668130304"
];
const DEFAULT_LEVELUP_CHANNEL = '353775506128109570';

module.exports = (oldMember, newMember, Client) => {
	const entry = Client.provider.get(newMember.guild, 'guildMemberUpdate', false);
	if (entry && entry.log) {
		if (oldMember.nickname !== newMember.nickname) {
			const body = newMember.nickname? `**${newMember.user.tag}** has changed their nickname` + (oldMember.nickname? ` from **${oldMember.nickname}**` : ``) + ` to **${newMember.nickname}**`
				: `**${newMember.user.tag}** has removed their nickname, **${oldMember.nickname}**`;
			newMember.guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
				.setColor('GREEN')
				.setThumbnail(newMember.user.avatarURL)
				.setTitle('Nickname change')
				.setDescription(body)
				.setTimestamp((new Date()).toISOString())
			);
		}

		if (oldMember.user.tag !== newMember.user.tag) {
			newMember.guild.channels.find(val => val.id === entry.log).end(new RichEmbed()
				.setColor('GREEN')
				.setThumbnail(newMember.user.avatarURL)
				.setTitle('Username change')
				.setDescription(`**${oldMember.user.tag}** has changed their username to **${newMember.user.tag}**`)
				.setTimestamp((new Date()).toISOString())
			);
		}
	}

	// Shield Hero stuff
	const diffRoles = newMember.roles.filter(r => !oldMember.roles.has(r.id));

	const diffLeveledRoles = diffRoles.filter(r => LEVELED_ROLES.includes(r.id));

	if (diffLeveledRoles.size) {
		const role = diffLeveledRoles.last();
		if (!newMember.lastMessage) {
			const channel = newMember.guild.channels.get(DEFAULT_LEVELUP_CHANNEL);

			if (!channel) {
				return;
			}

			// Very edge case, so apologies for mutating variables
			newMember.lastMessage = { channel: channel };
		}

		return newMember.lastMessage.channel.send(new RichEmbed()
			.setColor(newMember.displayColor || global.BOT_DEFAULT_COLOR)
			.setimage(newMember.avatarURL || newMember.defaultAvatarURL)
			.setDescription(`${newMember.toString()} has now leveled up to role ${to.toString()}!`)
		);

		// newMember.lastMessage.channel.send(`🆙  |  ${newMember.toString()} is now \`${role.name}\`!`);
	}
}
