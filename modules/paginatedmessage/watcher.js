import { BACKWARD_EMOJI, FORWARD_EMOJI } from './EuphemiaPaginatedMessage.js';

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
			.setFooter({ text: `${args.currentIndex + 1}/${args.length}` });

		return message.edit({ embeds: [embed] });
	}

	if (emoji.name === BACKWARD_EMOJI) {
		const embed = generator(await args.previous())
			.setFooter({ text: `${args.currentIndex + 1}/${args.length}` });

		return message.edit({ embeds: [embed] });
	}
};

const watch = client => {
	client.on('messageReactionAdd',		(...args) => _watcher(...args).catch(() => {}));
	client.on('messageReactionRemove',	(...args) => _watcher(...args).catch(() => {}));
};

const init = client => {
	watch(client);
};

export { init };
