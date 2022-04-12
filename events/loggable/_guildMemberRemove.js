import { Formatters, MessageEmbed } from 'discord.js';
import { replaceTokens }            from '../util.js';

export default async member => {
	const p1 = (async entry => {
		if (!entry.channel || !entry.message) {
			return;
		}

		const channel = member.guild.channels.cache.get(entry.channel);

		if (!channel) {
			return;
		}

		replaceTokens(entry.message.content ?? '', member);
		replaceTokens(entry.message.embeds?.[0] ?? '', member);

		return channel.send({
			content: entry.message.content,
			embeds:  entry.message.embeds.map(e => JSON.parse(replaceTokens(e, member)))
		});
	})(member.client.provider.get(member.guild, 'goodbye', { channel: null, message: null }));

	const p2 = (async entry => {
		if (!entry.guildMemberRemove) {
			return;
		}

		const channel = member.guild.channels.cache.get(entry.guildMemberRemove);

		if (!channel) {
			return;
		}

		return channel.send({
			embeds: [new MessageEmbed()
				.setColor('BLUE')
				.setTitle('❌ User left')
				.setThumbnail(member.user.displayAvatarURL())
				.setDescription(`${member}  ${Formatters.blockQuote(member.user.tag)}`)
				.addField('ID', member.id, false)
				.setTimestamp(member.joinedAt)]
		});
	})(member.client.provider.get(member.guild, 'log', { guildMemberRemove: null }));

	return Promise.all([p1, p2]);
};
