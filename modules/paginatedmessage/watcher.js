const {BACKWARD_EMOJI, FORWARD_EMOJI} = require('./EuphemiaPaginatedMessage');

const _watcher = async ({message, emoji}, user) => {
	if (!message.pagination) {
		return;
	}

	if (user.bot) {
		return;
	}

	const {generator, args} = message.pagination;

	if (emoji.name === FORWARD_EMOJI) {
		const embed = generator(args.next())
			.setFooter(`${args.current + 1}/${args.length}`);

		return message.edit(embed);
	}

	if (emoji.name === BACKWARD_EMOJI) {
		const embed = generator(args.previous())
			.setFooter(`${args.current + 1}/${args.length}`);

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
