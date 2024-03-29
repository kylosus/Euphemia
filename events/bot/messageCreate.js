import { EmbedBuilder, Colors } from 'discord.js';

export default async message => {
	if (message.guild || message.author.id === message.client.user.id) {
		return;
	}

	if (!message.client.owners.length) {
		return;
	}

	const embed = new EmbedBuilder()
		.setColor(Colors.Blue)
		.setThumbnail(message.author.displayAvatarURL())
		.setTitle(`DM from ${message.author.tag}`)
		.setDescription(message.content || '~');

	((attachment) => {
		if (!attachment) {
			return;
		}

		if (/\.(gif|jpg|jpeg|tiff|png|webm|webp)$/i.test(attachment.url)) {
			return embed.setImage(attachment.proxyURL);
		}

		return embed.addFields({
			name:  'Attachment',
			value: attachment.name + '\n' + `[Link](${attachment.proxyURL})`
		});
	})(message.attachments.first());

	message.client.owners.forEach(owner => {
		if (message.author.id !== owner.id) {
			return owner.send({ embeds: [embed] });
		}
	});
};
