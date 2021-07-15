const { MessageEmbed }  = require('discord.js');
const { replaceTokens } = require('../util');

module.exports = async member => {
	const p1 = (async entry => {
		if (!entry.channel || !entry.message) {
			return;
		}

		const channel = member.guild.channels.cache.get(entry.channel);

		if (!channel) {
			return;
		}

		return channel.send(
			replaceTokens(entry.message.content),
			new MessageEmbed(replaceTokens(entry.message.embed))
		);
	})(member.client.provider.get(member.guild, 'goodbye', { channel: null, message: null }));

	const p2 = (async entry => {
		if (!entry.guildMemberRemove) {
			return;
		}

		const channel = member.guild.channels.cache.get(entry.guildMemberRemove);

		if (!channel) {
			return;
		}

		return channel.send(new MessageEmbed()
			.setColor('BLUE')
			.setTitle('❌ User left')
			.setThumbnail(member.user.displayAvatarURL())
			.setDescription(`${member} \`${member.user.tag}\``)
			.addField('ID', member.id, false)
			.setTimestamp(member.joinedAt)
		);
	})(member.client.provider.get(member.guild, 'log', { guildMemberRemove: null }));

	return Promise.all([p1, p2]);
};
