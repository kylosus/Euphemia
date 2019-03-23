const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');
const DAYS_TO_PURGE	= 0;

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'moderation',
			memberName: 'ban',
			description: 'Bans mentioned users',
			userPermissions: ['BAN_MEMBERS'],
			examples: [`${client.commandPrefix}ban @user`, `${client.commandPrefix}ban @user1 @user2 @user3`],
			guildOnly: true
		});
	}

	async run(message) {
		if (!message.mentions.members.size) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('Please mention members to kick')
			);
		}

		const banned = [];

		message.mentions.members.tap(async member => {
			if (!member.bannable) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle(`User ${member.user.tag} was not banned. Reason: member is higher than the bot in the role hierarchy.`)
				);
			}

			try {
				await member.ban(DAYS_TO_PURGE);
				banned.push(member.user.tag);
			} catch (error) {
				message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle(`User ${member.user.tag} was not banned. Reason: ${error}.`)
				);
			}

		});

		banned.forEach(tag => {
			message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle(`User ${tag} has been banned by ${message.author.tag}.`)
			);
		});
	}
};
