// const { Command }               = require('discord.js-commando');
// const { RichEmbed }             = require('discord.js');
// const _                         = require('lodash');
// const EuphemiaPaginatedMessage  = require('../../util/EuphemiaPaginatedMessage.js');
//
// module.exports = class extends Command {
// 	constructor(client) {
// 		super(client, {
// 			name: 'intag',
// 			group: 'subscription',
// 			memberName: 'intag',
// 			description: 'Lists all users subscribed to a tag',
// 			examples: [`${client.commandPrefix}intag Clannad`],
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
//
// 		if (!users.length) {
// 			return message.channel.send(new RichEmbed()
// 				.setColor('RED')
// 				.setTitle(`Tag ${tag} does not any members subscribed to it`)
// 			);
// 		}
//
// 		const pages = _.chunk(users, 90);
//
// 		return EuphemiaPaginatedMessage(pages.map(chunk => new RichEmbed()
// 			.setColor(global.BOT_DEFAULT_COLOR)
// 			.addField(`Users subscribed to ${tag}`, chunk.join(' '))
// 		), message);
// 	}
// };