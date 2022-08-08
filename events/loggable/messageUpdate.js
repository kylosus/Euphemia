import { inlineCode, channelMention, EmbedBuilder, Colors } from 'discord.js';
import { EmbedLimits }                                      from '../../lib/index.js';
import { truncate }                                         from 'lodash-es';

export default async (channel, oldMessage, newMessage) => {
	if (oldMessage.content === newMessage.content || !oldMessage.content || !newMessage.content) {
		return;
	}

	oldMessage.content = truncate(oldMessage.content, { length: EmbedLimits.FIELD_VALUE });
	newMessage.content = truncate(newMessage.content, { length: EmbedLimits.FIELD_VALUE });

	return channel.send({
		embeds: [new EmbedBuilder()
			.setColor(Colors.Purple)
			.setTitle(`🖊 Message edited in #${newMessage.channel.name}`)
			.setDescription(`${newMessage.member?.toString() || 'Unknown user'} ${inlineCode(newMessage.author?.id ?? 'Unknown id')} [Link](${newMessage.url})`)

			.addFields(
				{ name: 'ID', value: `${channelMention(oldMessage.channel.id)}/${oldMessage.id}`, inline: false },
				{ name: 'Old message', value: oldMessage.content, inline: false },
				{ name: 'New message', value: newMessage.content, inline: false }
			)
			.setTimestamp()]	// Do I need moment // NO
	});
};
