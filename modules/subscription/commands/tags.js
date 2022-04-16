import { Formatters, MessageEmbed }                     from 'discord.js';
import { ECommand }                                     from '../../../lib/index.js';
import { getTagIdMax, getTagsForward, getTagsBackward } from '../db.js';
import { CircularListGenerator, PaginatedMessage }      from '../../paginatedmessage/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['tags'],
			description: {
				content:  'Lists all tags in the server',
				usage:    '',
				examples: ['tags']
			},
			// args:        [
			// 	{
			// 		id:       'tagName',
			// 		type:     ArgConsts.TYPE.WORD,
			// 		optional: false,
			// 		message: 'Please enter a tag name'
			// 	}
			// ],
			guildOnly: true,
			ownerOnly: false
		});
	}

	async run(message) {
		const perPage = 20;

		const { length } = await getTagIdMax({ guild: message.guild });

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
			const embed = new MessageEmbed()
				.setColor('GREEN')
				.setTitle(`Tags in ${message.guild.toString()}`);

			const body = s
				.map(({ name, numSubscriptions }) => {
					// return `${enabled ? name : Formatters.strikethrough(name)}\t(${numSubscriptions}) subs`;
					return `${Formatters.inlineCode(name)} ${numSubscriptions} subs`;
				})
				.join('\n');

			embed.setDescription(body);
			return embed;
		};

		return PaginatedMessage.register(message, generator, result);
	}
}
