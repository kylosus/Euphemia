// const { Command } = require('discord.js-commando');
// const { RichEmbed } = require('discord.js');
// const _ = require('lodash');
//
// module.exports = class extends Command {
// 	constructor(client) {
// 		super(client, {
// 			name: 'tag',
// 			group: 'subscription',
// 			memberName: 'tag',
// 			description: 'Mentions users subscribed to a tag',
// 			examples: [`${client.commandPrefix}tag Clannad`],
// 			throttling: {
// 				usages: 1,
// 				duration: 60
// 			},
// 			guildOnly: true
// 		});
// 	}
//
// 	async run(message) {
// 		const tag = message.content.split(' ').splice(1).join(' ').toLowerCase();
//
// 		if (!tag) {
// 			return message.channel.send(new RichEmbed()
// 				.setColor('RED')
// 				.setTitle('Please mention a tag')
// 			);
// 		}
//
// 		const collection = this.client.database.collection('subscriptions');
//
// 		const entry = await collection.findOne({_id: message.guild.id, [tag]: {$exists: true}});
//
// 		if (!entry) {
// 			return message.channel.send(new RichEmbed()
// 				.setColor('RED')
// 				.setTitle(`Tag ${tag} does not exist`)
// 			);
// 		}
//
// 		const users = entry[tag].map(user => `<@${user}>`);
// 		if (!users.length) {
// 			return message.channel.send(new RichEmbed()
// 				.setColor('RED')
// 				.setTitle(`Tag ${tag} does not any members subscribed to it`)
// 			);
// 		}
//
// 		let first = true;
// 		const messages = _.chunk(users, 90);
//
// 		messages.forEach(async chunk => {
// 			if (!first) {
// 				return message.channel.send(chunk.join(' '));
// 			}
//
// 			await message.channel.send(`🌸 **Users subscribed to ${tag}**\n${chunk.join(' ')}`);
// 			first = false;
// 		});
// 	}
// };