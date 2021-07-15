const { MessageEmbed } = require('discord.js');

const CONTENT_MAX = 1020;

module.exports = async (channel, message) => {
	const embed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(`🗑 Message deleted in #${message.channel.name}`)
		.setDescription(message.author || 'Unknown user')
		.addField('ID', `${message.channel.id}/${message.id}`, false)
		.setTimestamp();

	const content = ((message) => {
		if (message.content.length >= CONTENT_MAX) {
			return message.content.substring(0, CONTENT_MAX) + '...';
		}

		return message.content;
	})(message);

	if (content) {
		embed.addField('Content', content, false);
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
