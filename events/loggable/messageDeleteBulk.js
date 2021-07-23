const { MessageAttachment }      = require('discord.js');
const { AutoEmbed, EmbedLimits } = require('../../lib');

module.exports = async (channel, messages) => {
	const embed = new AutoEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(`🗑 ${messages.size} messages bulk deleted in #${messages.first().channel.name}`)
		.addField('Channel ID', messages.first().channel.id, false)
		.setTimestamp();

	const content = messages.map(m => {
		const url = m.attachments.first()?.proxyURL ?? null;
		return `[${m.author || 'Unknown user'}] [${m.id}]: ${m.content ?? ''}${url ? `[Attachment](${url})` : ''}`;
	});

	const additions = (c => {
		if (c.length > EmbedLimits.DESCRIPTION) {
			return new MessageAttachment(Buffer.from(c), 'messages.txt');
		}

		return null;
	})(content.join('\n'));

	embed.setDescription(content.reverse().join('\n'));

	return channel.send([embed, additions]);
};