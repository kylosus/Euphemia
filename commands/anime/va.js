import { ECommand, ArgConsts }       from '../../lib/index.js';
import { fetchAnime }                from './util.js';
import { readFileSync }              from 'fs';
import { SelectionPaginatedMessage } from '../../modules/index.js';
import { MessageEmbed }              from 'discord.js';

const query = readFileSync(new URL('./va-query.graphql', import.meta.url), 'utf8');

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:       ['va', 'voiceactor'],
			description:   {
				content:  'Searches for voice actors of characters',
				usage:    '<character>',
				examples: ['va Anya']
			},
			args:          [
				{
					id:      'characterName',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please enter a character name'
				}
			],
			cached:        true,
			cacheEviction: 1000 * 60 * 60 * 24,	// 1 day
			guildOnly:     false,
			ownerOnly:     false,
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
			.filter(c => c.media.edges[0].voiceActors[0])
			.map(c => ({
				label: `${c.name.userPreferred} (${c.media.edges[0].node.title.userPreferred})`.slice(0, 100),
				data:  c
			}));

		if (!selectionOptions.length) {
			throw 'No voice actors found for the character';
		}

		return SelectionPaginatedMessage.register(message, s => {
			const voiceActor = s.media.edges[0].voiceActors[0];
			return new MessageEmbed()
				.setColor(this.client.config.COLOR_OK)
				.setAuthor({
					name:    s.name.userPreferred,
					url:     s.siteUrl,
					iconURL: s.image.medium
				})
				.setTitle(voiceActor.name.userPreferred)
				.setURL(voiceActor.siteUrl)
				.setThumbnail(voiceActor.image.large)
				.setFooter({ text: `Anime ${s.media.edges[0].node.title.userPreferred}` })
				.setDescription(voiceActor.characters.nodes.map(c => `${c.name.userPreferred} (${c.media.nodes[0].title.userPreferred})`).join('\n'));
		}, selectionOptions);
	}
}
