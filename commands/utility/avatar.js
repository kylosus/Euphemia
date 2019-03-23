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
				.setImage(member.user.avatarURL ?
					`https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}${member.user.avatar.startsWith('a') ? 
						'.gif' : ''}?size=1024` : member.user.defaultAvatarURL
				)
			);
		} else {
			return message.channel.send(new RichEmbed()
				.setDescription('Your avatar')
				.setColor(global.BOT_DEFAULT_COLOR)
				.setImage(message.author.avatarURL ?
					`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}${message.author.avatar.startsWith('a') ? 
						'.gif' : ''}?size=1024` : message.author.defaultAvatarURL
				)
			);
		}
	}
};
