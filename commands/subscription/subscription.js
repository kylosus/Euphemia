const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'subscription',
			group: 'subscription',
			memberName: 'subscription',
			description: 'Manages tag subscription commands',
			examples: [
				`${client.commandPrefix}subscription add Clannad`,
				`${client.commandPrefix}subscription remove Clannad`,
				`${client.commandPrefix}subscription clear userID`
			],
			userPermissions: ['MANAGE_ROLES'],
			aliases: ['subn'],
			guildOnly: true
		});
	}

	async run(message) {
		const args = message.content.split(' ');
		const collection = this.client.database.collection('subscriptions');

		if (args[1] === 'add') {
			const tag = args.splice(2).join(' ').toLowerCase();

			if (!tag) {
				return _sendWarning(message.channel, 'Please enter a tag to add');
			}

			const query = {};
			query[tag] = {$exists: false};

			const entry = await collection.findOne({_id: message.guild.id, [tag]: {$exists: true}});

			if (entry) {
				return _sendWarning(message.channel, `Tag ${tag} already exists`);
			}

			collection.updateOne(
				{_id: message.guild.id},
				{$set: {[tag]: []}},
				{upsert: true}
			);

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle(`Added new tag ${tag}`)
			);

		}

		if (args[1] === 'remove') {
			const tag = args.splice(2).join(' ').toLowerCase();

			if (!tag) {
				_sendWarning(message.channel, 'Please enter a tag to add');
			}

			const entry = await collection.findOne({_id: message.guild.id, [tag]: {$exists: true}});

			if (!entry) {
				_sendWarning(message.channel, `Tag ${tag} does not exist`);
			}

			const query = {};
			query[tag] = [];
			collection.updateOne(
				{_id: message.guild.id},
				{$unset: query}
			);

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.addField(`Removed tag ${tag}`, `Tag had ${entry[tag] ? entry[tag].length : 0} members`)
			);
		}

		if (args[1] === 'purge') {
			const result = await collection.removeOne({_id: message.guild.id});
			if (!result.deletedCount) {
				return _sendWarning(message.channel, 'This server does not have any registered tags');
			}

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle('Purged all tags from this server')
			);

		}

		if (args[1] === 'clear') {
			if (!/\d+/.test(args[2])) {
				return _sendWarning(message.channel, 'Please enter a user to clear');
			}

			const entry = await collection.findOne({_id: message.guild.id}, {projection: {_id: false}});

			let tagCount = 0;
			const pullQuery = {};

			for (let tag in entry) {
				if (entry[tag].indexOf(args[2]) !== -1) {
					pullQuery[tag] = args[2];
					tagCount++;
				}
			}

			if (!tagCount) {
				return _sendWarning(message.channel, `User ${args[2]} is not registered in any tags`);
			}

			collection.updateOne({_id: message.guild.id}, {$pull: pullQuery});

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle(`Cleared user ${args[2]} from ${tagCount} tags`)
			);
		}
	}
};

function _sendWarning(channel, text) {
	return channel.send(new RichEmbed()
		.setColor('RED')
		.setTitle(text)
	);
}
