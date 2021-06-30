// const EuphemiaLinkedList = require('./CircularList.js');
//
// module.exports = async (message, generator, args) => {
// 	const firstEmbed = generator(args[0])
// 		.setFooter(`1/${args.length}`);
//
// 	const botMessage = await message.channel.send(firstEmbed);
// 	const argsList = new EuphemiaLinkedList(args);
//
// 	if (args.length > 1) {
// 		botMessage.react('⬅');
// 		botMessage.react('➡');
// 	}
//
// 	message.paginated = true;
//
// 	const listener = (async (messageReaction, reactionUser) => {
// 		if (reactionUser.id === message.author.id) {
// 			if (messageReaction.message.guild && messageReaction.message.guild.me.hasPermission('MANAGE_MESSAGES')) {
// 				messageReaction.remove(reactionUser);
// 			}
// 		}
// 		if (messageReaction.message.id === botMessage.id) {
// 			if (reactionUser.id === message.author.id) {
// 				if (messageReaction.emoji.name === '➡') {
// 					await botMessage.edit(embedList.next().setFooter(`${embedList.getCurrentIndex()}/${embedList.getSize()}`));
// 				} else if (messageReaction.emoji.name === '⬅') {
// 					await botMessage.edit(embedList.previous());
// 					await botMessage.edit(embedList.previous());
// 				}
// 			}
// 		}
// 	});
//
// 	message.client.on('messageReactionAdd', listener);
//
// 	message.client.setTimeout((message, listener) => {
// 		if (message.guild && message.guild.me.hasPermission('MANAGE_MESSAGES')) {
// 			message.clearReactions();
// 		}
//
// 		message.client.removeListener('messageReactionAdd', listener);
// 	},  embeds.length <= 3 ? 30000 : embeds.length * 10000, botMessage, listener);
// };
