const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'purge',
			group: 'moderation',
			memberName: 'purge',
			description: 'Purges a specified amount of messages',
			aliases: ['p'],
			userPermissions: ['MANAGE_MESSAGES'],
			clientPermissions: ['MANAGE_MESSAGES'],
			guildOnly: true
		});
	}

	async run(message, arg) {
		if (!arg.length) {
			message.channel.fetchMessages({limit: 2}).then(messages => {
				message.channel.bulkDelete(messages);
			});

			return;
		}

		let num = Number(arg);

		if (!num && num < 0) {
			return message.embed(new RichEmbed()
				.setColor('RED')
				.setTitle('Please check your input')
			);
		}

		num = num > 100 ? 100 : num;

		const deleted = await message.channel.bulkDelete(num);

		const reply = await message.channel.send(new RichEmbed()
			.setColor('GREEN')
			.setTitle(`Deleted ${deleted.size} messages`)
		);

		this.client.setTimeout((reply) => {
			reply.delete();
		}, 2000, reply);
	}
};
