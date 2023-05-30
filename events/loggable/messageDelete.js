import { AttachmentBuilder, channelMention, Colors } from 'discord.js';
import { AutoEmbed, AutoEmbedLimits }                from '../../lib/index.js';
import { Buffer }                                    from 'node:buffer';

export default async (channel, message) => {
	const payload = {};

	const embed = new AutoEmbed()
		.setColor(Colors.DarkPurple)
		.setTitle(`🗑 Message deleted in #${message.channel.name}`)
		.setDescription(message.author.toString() ?? 'Unknown user')
		.addFields({ name: 'ID', value: `${channelMention(message.channel.id)}/${message.id}`, inline: false })
		.setTimestamp();

	if (message.content) {
		// Will overflow
		if (message.content.length > AutoEmbedLimits.FIELD_VALUE_WRAPPED) {
			payload.files = [
				new AttachmentBuilder(Buffer.from(message.content), { name: 'content.txt' })
			];
		}

		embed.addFieldsWrap({
			name:   'Content',
			value:  message.content,
			inline: false
		});
	}

	((attachment) => {
		if (!attachment) {
			return;
		}

		// TODO: check if the videos are embedded properly
		if (/\.(gif|jpg|jpeg|tiff|png|webm|webp)$/i.test(attachment.url)) {
			return embed.setImage(attachment.proxyURL);
		}

		return embed.addFields({
			name:  'Attachment',
			value: attachment.name + '\n' + `[Link](${attachment.proxyURL})`
		});
	})(message.attachments.first());

	payload.embeds = [embed];

	return channel.send(payload);
};
