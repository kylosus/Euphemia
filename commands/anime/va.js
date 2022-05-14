import { ECommand, ArgConsts }       from '../../lib/index.js';
import { fetchAnime }                from './util.js';
import { readFileSync }              from 'fs';
import { SelectionPaginatedMessage } from '../../modules/index.js';
import { MessageEmbed }              from 'discord.js';

const query = readFileSync(new URL('./va-query.graphql', import.meta.url), 'utf8');

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['va'],
			description: {
				content:  'Searches for voice actors of characters',
				usage:    '<character>',
				examples: ['va Anya']
			},
			args:        [
				{
					id:      'characterName',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please enter a character name'
				}
			],
			guildOnly:   false,
			ownerOnly:   false,
		});
	}

	async run(message, { characterName }) {
		const variables = {
			characterName,
			maxCharacters: 25
		};

		const { data } = await fetchAnime(query, variables).catch(() => {
			throw 'Character not found';
		});

		if (!data.Page.characters.length) {
			throw 'No voice actors found for the character';
		}

		return data.Page.characters;
	}

	async ship(message, characters) {
		const selectionOptions = characters
			.filter(c => c.media.edges.length)
			.map(c => ({
				label: c.name.userPreferred,
				data: c
			}));

		return SelectionPaginatedMessage.register(message, s => {
			return new MessageEmbed()
				.setDescription(s.name.userPreferred);
		}, selectionOptions);
	}
}
