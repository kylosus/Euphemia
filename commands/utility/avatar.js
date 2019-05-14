const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			group: 'utility',
			memberName: 'avatar',
			description: 'Shows avatar of a given user'
		});
	}

	async run(message) {
		if (message.guild) {
			const match = message.content.match(/\d{18}/);
			const member = match ? message.guild.members.get(match[0]) : message.member;
			return message.channel.send(new RichEmbed()
				.setDescription(`${member.toString()}'s avatar`)
				.setColor(member.displayColor)
				.setImage(member.user.displayAvatarURL)
			);
		} else {
			return message.channel.send(new RichEmbed()
				.setDescription('Your avatar')
				.setColor(global.BOT_DEFAULT_COLOR)
				.setImage(message.author.displayAvatarURL)
			);
		}
	}
};
