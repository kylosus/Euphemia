const { RichEmbed } = require('discord.js');

module.exports = message => {
	if (message.author.id === message.client.user.id) {
		message.client.messageStats.sent++;
	} else {
		message.client.messageStats.received++;
	}

	if (!message.guild && message.author !== message.client.user.id) {
		if (message.client.owners) {
			const embed = new RichEmbed()
				.setColor('BLUE')
				.setImage(message.author.avatarURL || message.author.defaultAvatarURL)
				.setTitle('Bot has received a DM')
				.addField(message.author.tag, message.content || '-');

			if (message.embeds.length >= 1) {
				if (message.embeds[0].image) {
					embed.setImage(message.embeds[0].image.url);
				}
			}

			embed.addField('Attachments',
				message.attachments
					.map(attachment => attachment.url)
					.join('\n')
			);

			message.client.owners.forEach(owner => {
				if (message.author.id !== owner.id) {
					return owner.send(embed);
				}
			});
		}
	}
};
