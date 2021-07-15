const { MessageEmbed }  = require('discord.js');
const moment            = require('moment');
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

		if (entry.message.embed) {
			return channel.send(
				replaceTokens(entry.message.content || '', member),
				new MessageEmbed(JSON.parse(replaceTokens(entry.message.embed || '', member)))
			);
		}

		return channel.send(
			replaceTokens(entry.message.content || '', member)
		);
	})(member.client.provider.get(member.guild, 'welcome', { channel: null, message: null }));

	const p2 = (async entry => {
		if (!entry.guildMemberAdd) {
			return;
		}

		const channel = member.guild.channels.cache.get(entry.guildMemberAdd);

		if (!channel) {
			return;
		}

		channel.send(new MessageEmbed()
			.setColor('BLUE')
			.setTitle('✅ User joined')
			.setThumbnail(member.user.displayAvatarURL())
			.setDescription(`${member} \`${member.user.tag}\``)
			.addField('ID', member.id, false)
			.addField('Joined server', moment(member.joinedAt).format('DD.MM.YYYY HH:mm:ss'), true)
			.addField('Joined Discord', moment(member.user.createdAt).format('DD.MM.YYYY HH:mm:ss'), false)
			.setTimestamp(member.joinedAt)
		);

		const accountAge = moment().diff(moment(member.user.createdAt), 'days');

		if (accountAge < 30) {
			return channel.send(new MessageEmbed()
				.setColor('DARK_RED')
				.setDescription(`**WARNING** User ${member}'s account is less than ${accountAge === 1 ? 'day' : ((accountAge + 1) + 'days')} old`)
			);
		}
	})(member.client.provider.get(member.guild, 'log', { guildMemberAdd: null }));

	// This is a historic moment, I finally found a use for deferred promise awaits
	return Promise.all([p1, p2]);

	// eslint-disable-next-line no-unused-vars
	// (entry => {
	// 	// if (!entry) {
	// 	//
	// 	// }
	// })(member.client.provider.get(member.guild, 'automute', false));
};


