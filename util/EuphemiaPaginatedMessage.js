const EuphemiaLinkedList = require('./EuphemiaLinkedList.js');

module.exports = (embeds, message) => {

    message.channel.send(embeds[0].setFooter(`1/${embeds.length}`)).then(async botMessage => {
        const embedList = new EuphemiaLinkedList(embeds);
        if (embeds.length > 1) {
            await botMessage.react('⬅');
            await botMessage.react('➡');
        }
        message.client.on('messageReactionAdd', listener);

        message.client.setTimeout((message, listener) => {
            if (message.guild && message.guild.me.hasPermission('MANAGE_MESSAGES')) {
                message.clearReactions();
            }
            message.client.removeListener('messageReactionAdd', listener);
        },  embeds.length <= 3 ? 30000 : embeds.length * 10000, botMessage, listener);
    });
}
	const listener = (async (messageReaction, reactionUser) => {
		if (reactionUser.id === message.author.id) {
			if (messageReaction.message.guild && messageReaction.message.guild.me.hasPermission('MANAGE_MESSAGES')) {
				messageReaction.remove(reactionUser);
			}
		}
		if (messageReaction.message.id === botMessage.id) {
			if (reactionUser.id === message.author.id) {
				if (messageReaction.emoji.name === '➡') {
					await botMessage.edit(embedList.next().setFooter(`${embedList.getCurrentIndex()}/${embedList.getSize()}`));
				} else if (messageReaction.emoji.name === '⬅') {
					await botMessage.edit(embedList.previous());
					await botMessage.edit(embedList.previous());
				}
			}
		}
	});
