const { Command }					= require('discord.js-commando');
const { RichEmbed }					= require('discord.js');
const guildMemberUnmuted			= require('../../events/guildMemberUnmuted');
const EuphemiaUnifiedGuildFunctions	= require('../../util/EuphemiaUnifiedGuildFunctions.js');


module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'unmute',
			group: 'moderation',
			memberName: 'unmute',
			description: 'Unmutes mentioned users',
			userPermissions: ['MANAGE_ROLES'],
			examples: [
				`${client.commandPrefix}unmute @user`,
				`${client.commandPrefix}unmute @user1 @user2 @user3`
			],
			guildOnly: true
		});
	}

	async run(message) {
		const role = EuphemiaUnifiedGuildFunctions.GetMutedRole(message.guild);

		if (!role) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('Muted role not found')
			);
		}

		if (!message.mentions.members.size) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('Please mention members to unmute')
			);
		}

		// Use a database
		const unmuted = Promise.all(message.mentions.members.map(async member => {
			if (!member.roles.has(role.id)) {
				message.channel.send(new RichEmbed()
					.setColor('RED')
					.setDescription(`**Member ${member.toString()} is not muted**`)
				);

				return null
			}

			try {
				await member.removeRole(role);
			} catch (error) {
				message.channel.send(new RichEmbed()
					.setColor('RED')
					.addField(`Could not unmute ${member.toString()}`, error.message)
				);

				return null;
			}

			guildMemberUnmuted(member);
			return member.toString();
		})).filter(member => member);

		return message.channel.send(new RichEmbed()
			.setColor('GREEN')
			.addField('Unmuted members', unmuted.join('\n'))
			.addField('Moderator', message.member.toString())
		);
	}
};
