const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'subscription',
            group: 'subscription',
            memberName: 'subscription',
            description: 'Manages tag subscription commands',
            examples: [`${client.commandPrefix}subscription add Clannad`, `${client.commandPrefix}subscription remove Clannad`, `${client.commandPrefix}subscription clear userID`],
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
           if (tag) {
               const query = {};
               query[tag] = {$exists: false};
            } else {
                sendWarning(message.channel, 'Please enter a tag to add');
            }
        } else if (args[1] === 'purge') {
            collection.removeOne({_id: message.guild.id}).then(commandResult => {
                if (commandResult.deletedCount) {
                    return message.channel.send(new RichEmbed()
                        .setColor('GREEN')
                        .setTitle('Purged all tags from this server')
                    )
                } else {
                    sendWarning(message.channel, 'This server does not have any registered tags')
                }
            });
        } else if (args[1] === 'clear') {
            if (/\d{18}/.test(args[2])) {
                collection.findOne({_id: message.guild.id}, {projection: {_id: false}}).then(entry => {
                    const pullQuery = {};
                    let tagCount = 0;
                    for (let tag in entry) {
                        if (entry[tag].indexOf(args[2]) !== -1) {
                            pullQuery[tag] = args[2];
                            tagCount++;
                        }
                    }
                    if (tagCount) {
                        collection.updateOne({_id: message.guild.id}, {$pull : pullQuery}).then(commandResult => {
                            return message.channel.send(new RichEmbed()
                                .setColor('GREEN')
                                .setTitle(`Cleared user ${args[2]} from ${tagCount} tags`)
                            );
                        });
                    } else {
                        return sendWarning(message.channel, `User ${args[2]} is not registered in any tags`);
                    }
                })
            } else {
                return sendWarning(message.channel, 'Please enter a user to clear');
            }
        } else {
            return sendWarning(message.channel, 'Please check your input');
        }
    }
};
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

			const entry = await collection.findOne({_id: message.guild.id, [tag]: {$exists: true}});

function sendWarning(channel, text) {
    return channel.send(new RichEmbed()
        .setColor('RED')
        .setTitle(text)
    );
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

			const result = await collection.removeOne({_id: message.guild.id});
			if (!result.deletedCount) {
				return _sendWarning(message.channel, 'This server does not have any registered tags');
			}
			const entry = await collection.findOne({_id: message.guild.id}, {projection: {_id: false}});

			let tagCount = 0;
			const pullQuery = {};

			for (let tag in entry) {
				if (entry[tag].indexOf(args[2]) !== -1) {
					pullQuery[tag] = args[2];
					tagCount++;
				}
};
