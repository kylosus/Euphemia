import { inlineCode, channelMention, Colors, AttachmentBuilder } from 'discord.js';
import { AutoEmbed, AutoEmbedLimits }                            from '../../lib/index.js';
import { Buffer }                                                from 'node:buffer';

export default async (channel, oldMessage, newMessage) => {
	if (oldMessage.content === newMessage.content || !oldMessage.content || !newMessage.content) {
		return;
	}

	const files = [...getFiles(oldMessage.content, 'old.txt'), ...getFiles(newMessage.content, 'new.txt')];

	const embed = new AutoEmbed()
		.setColor(Colors.Purple)
		.setTitle(`🖊 Message edited in #${newMessage.channel.name}`)
		.setDescription(`${newMessage.member?.toString() || 'Unknown user'} ${inlineCode(newMessage.author?.id ?? 'Unknown id')} [Link](${newMessage.url})`)
		.addFields(
			{ name: 'ID', value: `${channelMention(oldMessage.channel.id)}/${oldMessage.id}`, inline: false },
		)
		.addFieldsWrap(
			{ name: 'Old message', value: oldMessage.content, inline: false },
			{ name: 'New message', value: newMessage.content, inline: false }
		)
		.setTimestamp();

	return channel.send({
		files,
		embeds: [embed]	// Do I need moment // NO
	});
};

function getFiles(content, name) {
	// Will overflow
	if (content.length > AutoEmbedLimits.FIELD_VALUE_WRAPPED) {
		return [new AttachmentBuilder(Buffer.from(content), { name })];
	}

	return []
}
