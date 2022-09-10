import { Buffer }                 from 'node:buffer';
import { MessageAttachment }      from 'discord.js';
import { AutoEmbed, EmbedLimits } from '../../lib/index.js';

const MOD_CHANNEL = '293432840538947584';

export default async (channel, messages) => {
	if (channel.id === MOD_CHANNEL) {
		return;
	}
	
	const embed = new AutoEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(`🗑 ${messages.size} messages bulk deleted in #${messages.first().channel.name}`)
		.addField('Channel ID', messages.first().channel.id, false)
		.setTimestamp();

	const content = messages.map(m => {
		const url = m.attachments.first()?.proxyURL ?? null;
		return `[${m.author?.toString() ?? 'Unknown user'}] [${m.id}]: ${m.content ?? ''}${url ? `[Attachment](${url})` : ''}`;
	});

	const files = (c => {
		if (c.length > EmbedLimits.DESCRIPTION) {
			return [new MessageAttachment(Buffer.from(c), 'messages.txt')];
		}

		return null;
	})(content.join('\n'));

	embed.setDescription(content.reverse().join('\n'));

	return channel.send({ embeds: [embed], files });
};
