import { Buffer }                    from 'node:buffer';
import { AttachmentBuilder, Colors } from 'discord.js';
import { AutoEmbed, EmbedLimits }    from '../../lib/index.js';

const MOD_CHANNEL = '293432840538947584';

export default async (channel, messages) => {
	if (channel.id === MOD_CHANNEL) {
		return;
	}
	
	const embed = new AutoEmbed()
		.setColor(Colors.DarkPurple)
		.setTitle(`🗑 ${messages.size} messages bulk deleted in #${messages.first().channel.name}`)
		.addFields({ name: 'Channel ID', value: messages.first().channel.id, inline: false })
		.setTimestamp();

	const content = messages.map(m => {
		const url = m.attachments.first()?.proxyURL ?? null;
		return `[${m.author?.toString() ?? 'Unknown user'}] [${m.id}]: ${m.content ?? ''}${url ? `[Attachment](${url})` : ''}`;
	});

	const files = (c => {
		if (c.length > EmbedLimits.DESCRIPTION) {
			return [new AttachmentBuilder(Buffer.from(c), { name: 'messages.txt' })];
		}

		return null;
	})(content.join('\n'));

	embed.setDescription(content.reverse().join('\n'));

	return channel.send({ embeds: [embed], files });
};
