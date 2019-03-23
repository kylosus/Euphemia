const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'moderation',
            memberName: 'kick',
            description: 'Kicks mentioned users',
            userPermissions: ['KICK_MEMBERS'],
            examples: [`${client.commandPrefix}kick @user`, `${client.commandPrefix}kick @user1 @user2 @user3`],
            guildOnly: true
        });
    };

	async run(message) {
		if (!message.mentions.members.size) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('Please mention members to kick')
			);
		}

		const kicked = [];

		message.mentions.members.tap(async member => {
			if (!member.kickable) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle(`User ${member.user.tag} was not kicked. Reason: member is higher than the bot in the role hierarchy.`)
				);
			}

			try {
				await member.kick();
				kicked.push(member.user.tag);
			} catch (error) {
				message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle(`User ${member.user.tag} was not kicked. Reason: ${error}.`)
				);
			}

		});

		kicked.forEach(tag => {
			message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle(`User ${tag} has been kicked by ${message.author.tag}.`)
			);
		});
	}
};
