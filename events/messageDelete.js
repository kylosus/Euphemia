const {RichEmbed}	= require('discord.js');
const moment		= require('moment');

const CONTENT_MAX = 1020;

module.exports =  message => {
	const entry = message.client.provider.get(message.guild, 'messageDelete', false);

	if (!entry || !entry.log) {
		return;
	}
	
	if (!message.content) {
		return;
	}

	const channel = message.guild.channels.get(entry.log);

	if (!channel) {
		return;
	}

	const content = ((message) => {
		if (message.content.length >= CONTENT_MAX) {
			return message.content.substring(0, CONTENT_MAX) + '...';
		} else {
			return message.content;
		}
	})(message);

	channel.send(new RichEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(`🗑 Message deleted in #${message.channel.name}`)
		.setDescription(`${message.member ? message.member.toString() : message.author.tag} \`${message.author.id}\``)
		.addField('Content', content, false)
		.addField('ID', message.id, false)
		.setTimestamp(moment().toDate())
	);
};
