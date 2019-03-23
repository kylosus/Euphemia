const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'subscribe',
			group: 'subscription',
			memberName: 'subscribe',
			description: 'Subscribes user to a tag',
			examples: [`${client.commandPrefix}subscribe Clannad`],
			aliases: ['sub'],
			guildOnly: true
		});
	}

	async run(message) {
		const tag = message.content.split(' ').splice(1).join(' ').toLowerCase();
		const collection = this.client.database.collection('subscriptions');

		if (!tag) {
			const entry = await collection.findOne({_id: message.guild.id}, {projection: {_id: 0}});
			if (entry) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle('Please mention a tag to subscribe to')
				);
			} else {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle('This server does not have any registered tags')
				);
			}
		}

		const entry = await collection.findOne({_id: message.guild.id, [tag]: {$exists: true}});

		if (!entry) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle(`Tag ${tag} does not exist`)
			);
		}

		const commandResult = await collection.updateOne(
			{_id: message.guild.id},
			{$addToSet: {[tag]: message.author.id}},
		);


		if (!commandResult.result.nModified) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle(`You are already subscribed to ${tag}`)
			);
		}

		return message.channel.send(new RichEmbed()
			.setColor('GREEN')
			.setTitle(`Subscribed to ${tag}`)
		);
	}
};
