import { inlineCode, time, TimestampStyles, EmbedBuilder, Colors } from 'discord.js';
import { replaceTokens }                                           from '../util.js';
import dayjs                                                       from 'dayjs';

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
		const embeds  = entry.message.embed ? [JSON.parse(replaceTokens(entry.message.embed, member))] : null;

		return channel.send({
			content: content,
			embeds
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

		const ldt = TimestampStyles.LongDateTime;

		embeds.push(new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTitle('✅ User joined')
			.setThumbnail(member.user.displayAvatarURL())
			.setDescription(`${member.toString()} ${inlineCode(member.user.tag)}`)
			.addFields(
				{ name: 'ID', value: member.id, inline: false },
				{ name: 'Joined server', value: time(member.joinedAt, ldt), inline: true },
				{ name: 'Joined Discord', value: time(member.user.createdAt, ldt), inline: false }
			)
			.setTimestamp()
		);

		const accountAge = dayjs().diff(dayjs(member.user.createdAt), 'days');

		if (accountAge < 30) {
			embeds.push(new EmbedBuilder()
				.setColor(Colors.DarkRed)
				.setDescription(`**WARNING** User ${member.toString()}'s account is less than ${accountAge === 1 ? 'day' : ((accountAge + 1) + 'days')} old`)
			);
		}

		return channel.send({ embeds });
	})(member.client.provider.get(member.guild, 'log', { guildMemberAdd: null }));

	// This is a historic moment, I finally found a use for deferred promise awaits
	return Promise.all([p1, p2]);
};

