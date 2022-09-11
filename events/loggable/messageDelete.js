import { channelMention, EmbedBuilder, Colors } from 'discord.js';
import { EmbedLimits }                          from '../../lib/index.js';
import { truncate }                             from 'lodash-es';

const MOD_CHANNEL = '293432840538947584';

export default async (channel, message) => {
	if (channel.id === MOD_CHANNEL) {
		return;
	}

	const embed = new EmbedBuilder()
		.setColor(Colors.DarkPurple)
		.setTitle(`🗑 Message deleted in #${message.channel.name}`)
		.setDescription(message.author.toString() ?? 'Unknown user')
		.addFields({ name: 'ID', value: `${channelMention(message.channel.id)}/${message.id}`, inline: false })
		.setTimestamp();

	if (message.content) {
		embed.addFields({
			name:   'Content',
			value:  truncate(message.content, { length: EmbedLimits.FIELD_VALUE - 6 }),
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

	return channel.send({ embeds: [embed] });
};
