import { inlineCode, bold, EmbedBuilder, Colors } from 'discord.js';
import { replaceTokens }                          from '../util.js';
import * as AutoKick                              from '../../modules/autokick/index.js';

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
	})(member.client.provider.get(member.guild, 'goodbye', { channel: null, message: null }));

	const p2 = (async entry => {
		if (!entry.guildMemberRemove) {
			return;
		}

		const channel = member.guild.channels.cache.get(entry.guildMemberRemove);

		if (!channel) {
			return;
		}

		const embeds = [new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTitle('❌ User left')
			.setThumbnail(member.user.displayAvatarURL())
			.setDescription(`${member.toString()}  ${inlineCode(member.user.tag)}`)
			.addFields({ name: 'ID', value: member.id, inline: false })
			.setTimestamp(member.joinedAt)];

		if (AutoKick.getState(member.guild)) {
			embeds.push(new EmbedBuilder()
				.setColor(Colors.DarkRed)
				.setDescription(`${bold('WARNING')} Autokick is currently active`)
			);
		}

		return channel.send({ embeds });
	})(member.client.provider.get(member.guild, 'log', { guildMemberRemove: null }));

	return Promise.all([p1, p2]);
};
