const { EmbedLimits }  = require('../../lib');
const { MessageEmbed } = require('discord.js');
const _                = require('lodash');

module.exports = async (channel, message) => {
	const embed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(`🗑 Message deleted in #${message.channel.name}`)
		.setDescription(message.author || 'Unknown user')
		.addField('ID', `${message.channel.id}/${message.id}`, false)
		.setTimestamp();

	if (message.content) {
		embed.addField(
			'Content',
			_.truncate(message.content, { length: EmbedLimits.FIELD_VALUE - 6 })
			, false);
	}

	((attachment) => {
		if (!attachment) {
			return;
		}

		// TODO: check if the videos are embedded properly
		if (/\.(gif|jpg|jpeg|tiff|png|webm|webp)$/i.test(attachment.url)) {
			return embed.setImage(attachment.proxyURL);
		}

		return embed.addField('Attachment', attachment.name + '\n' + `[Link](${attachment.proxyURL})`);
	})(message.attachments.first());

	return channel.send(embed);
};
