import { Formatters, MessageEmbed } from 'discord.js';
import { replaceTokens }            from '../util.js';
import dayjs                        from 'dayjs';

export default async member => {
	const p1 = (async entry => {
		if (!entry.channel || !entry.message) {
			return;
		}

		const channel = member.guild.channels.cache.get(entry.channel);

		if (!channel) {
			return;
		}

		const content = replaceTokens(entry.message.content ?? '', member);
		const embed = entry.message.embed ? replaceTokens(entry.message.embed, member) : null;

		return channel.send({
			content: content,
			embeds:  [JSON.parse(embed)]
		});
	})(member.client.provider.get(member.guild, 'welcome', { channel: null, message: null }));

	const p2 = (async entry => {
		if (!entry.guildMemberAdd) {
			return;
		}

		const channel = member.guild.channels.cache.get(entry.guildMemberAdd);

		if (!channel) {
			return;
		}

		const embeds = [];

		embeds.push(new MessageEmbed()
			.setColor('BLUE')
			.setTitle('✅ User joined')
			.setThumbnail(member.user.displayAvatarURL())
			.setDescription(`${member} ${Formatters.blockQuote(member.user.tag)}`)
			.addField('ID', member.id, false)
			.addField('Joined server', Formatters.time(member.joinedAt, Formatters.TimestampStyles.LongDateTime), true)
			.addField('Joined Discord', Formatters.time(member.user.createdAt, Formatters.TimestampStyles.LongDateTime), false)
			.setTimestamp(member.joinedAt)
		);

		const accountAge = dayjs().diff(dayjs(member.user.createdAt), 'days');

		if (accountAge < 30) {
			embeds.push(new MessageEmbed()
				.setColor('DARK_RED')
				.setDescription(`**WARNING** User ${member}'s account is less than ${accountAge === 1 ? 'day' : ((accountAge + 1) + 'days')} old`)
			);
		}

		return channel.send({ embeds });
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

