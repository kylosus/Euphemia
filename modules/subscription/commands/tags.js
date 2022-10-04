import { inlineCode, EmbedBuilder }                     from 'discord.js';
import { ECommand }                                     from '../../../lib/index.js';
import { getTagIdMax, getTagsForward, getTagsBackward } from '../db.js';
import { CircularListGenerator, PaginatedMessage }      from '../../paginatedmessage/index.js';
import { COLOR, PER_PAGE }                              from './consts.js';
import { EmbedError }                                   from '../../../lib/Error/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['tags'],
			description: {
				content:  'Lists all tags in the server',
				usage:    '',
				examples: ['tags']
			},
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message) {
		const perPage = PER_PAGE;

		const { length } = await getTagIdMax({ guild: message.guild });

		if (!length) {
			throw new EmbedError('There are no tags in the server');
		}

		const [next, prev] = (() => {
			let lastID = 0;
			let prevID = 0;

			return [
				// Forward
				async () => {
					const results = await getTagsForward({
						guild: message.guild,
						lastID,
						perPage
					});

					prevID = lastID;
					lastID = results[results.length - 1].id;

					return results;
				},

				// Backward
				async () => {
					const results = await getTagsBackward({
						guild: message.guild,
						prevID,
						perPage
					});

					lastID = results[results.length - 1].id;

					return results;
				}
			];
		})();

		return new CircularListGenerator([], Math.ceil(length / perPage), next, prev);
	}

	async ship(message, result) {
		const generator = s => {
			const embed = new EmbedBuilder()
				.setColor(COLOR)
				.setTitle(`Tags in ${message.guild.toString()}`);

			const body = s
				.map(({ name, numSubscriptions }) => {
					return `${inlineCode(name)} ${numSubscriptions} subs`;
				})
				.join('\n');

			embed.setDescription(body);
			return embed;
		};

		return PaginatedMessage.register(message, generator, result);
	}
}
