import { Formatters, MessageEmbed } from 'discord.js';
import { EmbedLimits }              from '../../lib/index.js';
import { truncate }                 from 'lodash-es';

export default async (channel, oldMessage, newMessage) => {
	if (oldMessage.content === newMessage.content || !oldMessage.content || !newMessage.content) {
		return;
	}

	oldMessage.content = truncate(oldMessage.content, { length: EmbedLimits.FIELD_VALUE });
	newMessage.content = truncate(newMessage.content, { length: EmbedLimits.FIELD_VALUE });

	return channel.send({
		embeds: [new MessageEmbed()
			.setColor('PURPLE')
			.setTitle(`🖊 Message edited in #${newMessage.channel.name}`)
			.setDescription(`${newMessage.member?.toString() || 'Unknown user'} ${Formatters.inlineCode(newMessage.author?.id ?? 'Unknown id')} [Link](${newMessage.url})`)
			.addField('ID', `${Formatters.channelMention(oldMessage.channel.id)}/${oldMessage.id}`, false)
			.addField('Old message', oldMessage.content, false)
			.addField('New message', newMessage.content, false)
			.setTimestamp()]	// Do I need moment // NO
	});
};
