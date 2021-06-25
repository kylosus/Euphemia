// const { Command }	= require('discord.js-commando');
// const { RichEmbed }	= require('discord.js');
//
// module.exports = class extends Command {
// 	constructor(client) {
// 		super(client, {
// 			name: 'unsubscribe',
// 			group: 'subscription',
// 			memberName: 'unsubscribe',
// 			description: 'Removes user\'s subscription from a tag',
// 			examples: [`${client.commandPrefix}unsubscribe Clannad`],
// 			aliases: ['unsub'],
// 			guildOnly: true
// 		});
// 	}
//
// 	async run(message) {
// 		const tag = message.content.split(' ').splice(1).join(' ').toLowerCase();
// 		const collection = this.client.database.collection('subscriptions');
//
// 		if (!tag) {
// 			return message.channel.send(new RichEmbed()
// 				.setColor('RED')
// 				.setTitle('Please mention a tag to unsubscribe from')
// 			);
// 		}
//
// 		const entry = await collection.findOne({_id: message.guild.id, [tag]: {$exists: true}});
//
// 		// May fail. try try/catch
// 		if (!entry) {
// 			return message.channel.send(new RichEmbed()
// 				.setColor('RED')
// 				.setTitle(`Tag ${tag} does not exist`)
// 			);
// 		}
//
// 		const result = await collection.updateOne(
// 			{_id: message.guild.id},
// 			{$pull: {[tag]: message.author.id}}
// 		);
//
// 		if (!result.result.nModified) {
// 			return message.channel.send(new RichEmbed()
// 				.setColor('RED')
// 				.setTitle(`You are not subscribed to ${tag}`)
// 			);
// 		}
//
// 		return message.channel.send(new RichEmbed()
// 			.setColor('GREEN')
// 			.setTitle(`Unsubscribed from ${tag}`)
// 		);
// 	}
// };
