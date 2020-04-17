const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			group: 'moderation',
			memberName: 'stop',
			description: 'Denies message sending perms for @everyone',
			userPermissions: ['MANAGE_ROLES'],
			examples: [`${client.commandPrefix}stop on`, `${client.commandPrefix}stop off`],
			guildOnly: true
		});
	}

	async run(message, arg) {
		const everyone = message.guild.roles.get(message.guild.id);

		if (arg.toLowerCase().startsWith('off')) {
			await message.channel.overwritePermissions(everyone, { 'SEND_MESSAGES': true });

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle('Channel unlocked')
			);
		}

		const channel = await message.channel.overwritePermissions(everyone, { 'SEND_MESSAGES': false }, 'Euphemia stop command');

		// TODO: TRY-CATCH THIS
		await channel.overwritePermissions(
			message.member.roles
				.filter(role => role.hasPermission('MANAGE_GUILD'))
				.first() || message.author, { 'SEND_MESSAGES': true }, 'Euphemia stop command'
		);

		return channel.send(new RichEmbed()
			.setColor('RED')
			.setTitle('Channel locked down')
		);
	}
};
