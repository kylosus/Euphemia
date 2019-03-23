const EuphemiaEmbed = require('../util/EuphemiaEmbed.js');
const { RichEmbed } = require('discord.js');

module.exports = (member, Client) => {
	const entry = Client.provider.get(member.guild, 'guildMemberRemove', false);

	if (!entry) {
		return;
	}

	if (entry.message && entry.channel) {
		const message = entry.message
			.replace('$MENTION$', member.toString())
			.replace('$NAME$', member.user.tag)
			.replace('$MEMBER_COUNT$', _countNormalizer(member.guild.memberCount))
			.replace('$AVATAR$', member.user.avatarURL || member.user.defaultAvatarURL);

		const embed = EuphemiaEmbed.build(message);

		if (embed) {
			const channel = member.guild.channels.get(entry.channel);

			if (channel) {
				channel.send([embed.content], embed);
			}
		}
	}

	if (entry.log) {
		const channel = member.guild.channels.get(entry.log);

		if (channel) {
			channel.send(new RichEmbed()
				.setColor('BLUE')
				.setTitle('❌ User left')
				.setThumbnail(member.user.avatarURL)
				.setDescription(`${member.toString()} \`${member.user.tag}\``)
				.addField('ID', member.id, false)
				.setTimestamp(member.joinedAt)
			);
		}
	}
};

function _countNormalizer(count) {
	switch (count % 10) {
		case 1:
			return `${count}st`;
		case 2:
			return `${count}nd`;
		case 3:
			return `${count}rd`;
		default:
			return `${count}th`;
	}
}
