import { Formatters, MessageEmbed } from 'discord.js';
import { EmbedLimits }              from '../../lib/index.js';
import { truncate }     from 'lodash-es';

export default async (channel, oldMessage, newMessage) => {
	if (oldMessage.content === newMessage.content || !oldMessage.content || !newMessage.content) {
		return;
	}

	oldMessage.content = _.truncate(oldMessage.content, { length: EmbedLimits.FIELD_VALUE });
	newMessage.content = _.truncate(newMessage.content, { length: EmbedLimits.FIELD_VALUE });

	return channel.send(new MessageEmbed()
		.setColor('PURPLE')
		.setTitle(`🖊 Message edited in #${newMessage.channel.name}`)
		.setDescription(`${newMessage.member || 'Unknown user'} \`${newMessage.author?.id ?? 'Unknown id'}\` [Link](${newMessage.url})`)
		.addField('Old message', oldMessage.content, false)
		.addField('New message', newMessage.content, false)
		.addField('ID', oldMessage.id, false)
		.setTimestamp()	// Do I need moment // NO
	);
};
