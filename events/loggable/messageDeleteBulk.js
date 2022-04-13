import { MessageAttachment }      from 'discord.js';
import { AutoEmbed, EmbedLimits } from '../../lib/index.js';

export default async (channel, messages) => {
	const embed = new AutoEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(`🗑 ${messages.size} messages bulk deleted in #${messages.first().channel.name}`)
		.addField('Channel ID', messages.first().channel.id, false)
		.setTimestamp();

	const content = messages.map(m => {
		const url = m.attachments.first()?.proxyURL ?? null;
		return `[${m.author.toString() || 'Unknown user'}] [${m.id}]: ${m.content ?? ''}${url ? `[Attachment](${url})` : ''}`;
	});

	const additions = (c => {
		if (c.length > EmbedLimits.DESCRIPTION) {
			return new MessageAttachment(c, 'messages.txt');
		}

		return null;
	})(content.join('\n'));

	embed.setDescription(content.reverse().join('\n'));

	return channel.send({ embeds: [embed], files: [additions] });
};
