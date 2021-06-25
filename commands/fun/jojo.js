// const { Command }	= require('discord.js-commando');
// const { RichEmbed }	= require('discord.js');
// const QUOTES		= require('./jojo.js.json');
//
// module.exports = class extends Command {
// 	constructor(client) {
// 		super(client, {
// 			name: 'jojo',
// 			group: 'fun',
// 			memberName: 'jojo',
// 			description: 'Replies with a random JoJo quote.',
// 			aliases: ['duwang', 'nani'],
// 			throttling: {
// 				usages: 1,
// 				duration: 15
// 			}
// 		});
// 	}
//
// 	async run(message) {
// 		return message.channel.send(new RichEmbed()
// 			.setColor('RANDOM')
// 			.setTitle(QUOTES[Math.floor(Math.random() * QUOTES.length)])
// 		);
// 	}
// };
