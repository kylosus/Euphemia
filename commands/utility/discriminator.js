// const {MessageEmbed}			= require('discord.js');
// const {ArgumentType, ECommand}	= require('../../lib');
// const {flatten}					= require('../../lib/Argument');
// const _ = require('lodash');
//
// module.exports = class extends ECommand {
// 	constructor(client) {
// 		super(client, {
// 			aliases: ['discriminator', 'discrim'],
// 			description: {
// 				content: 'Lists members with the same discriminator',
// 				usage: '[discriminator]',
// 				examples: ['discrim', 'discrim 0001']
// 			},
// 			args: [
// 				{
// 					id: 'discriminator',
// 					type: new ArgumentType(/\d{4}/, flatten),
// 					optional: true,
// 					default: m => m.author.discriminator
// 				}
// 			],
// 			guildOnly: true,
// 			nsfw: false,
// 			ownerOnly: false,
// 			fetchMembers: true
// 		});
// 	}
//
// 	async run(message, args) {
// 		const members = message.guild.members.cache
// 			.filter(m => m.user.discriminator === args.discriminator)
// 			.map(member => member.user.username)
// 			.sort();
//
// 		if (!members.length) {
// 			throw 'No members found';
// 		}
//
// 		return [_.chunk(members, 20), args.discriminator];
// 	}
//
// 	async ship(message, result) {
// 		return EuphemiaPaginatedMessage(result[0].map(chunk => new MessageEmbed()
// 			.addField(`Users with discriminator #${result[1]}`, '```' + chunk.join('\n') + '```')
// 			.setColor('PURPLE')
// 		), message);
// 	}
//
// };
