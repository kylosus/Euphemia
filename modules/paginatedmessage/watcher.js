const { BACKWARD_EMOJI, FORWARD_EMOJI } = require('./EuphemiaPaginatedMessage');

const _watcher = async ({ message, emoji }, user) => {
	if (!message.pagination) {
		return;
	}

	if (user.bot) {
		return;
	}

	const { generator, args } = message.pagination;

	if (emoji.name === FORWARD_EMOJI) {
		const current = await args.next();

		const embed = generator(current)
			.setFooter(`${args.currentIndex + 1}/${args.length}`);

		return message.edit(embed);
	}

	if (emoji.name === BACKWARD_EMOJI) {
		const embed = generator(await args.previous())
			.setFooter(`${args.currentIndex + 1}/${args.length}`);

		return message.edit(embed);
	}
};

const watch = async client => {
	client.on('messageReactionAdd', _watcher);
	client.on('messageReactionRemove', _watcher);
};

const init = async client => {
	await watch(client);
};

module.exports = {
	init
};
