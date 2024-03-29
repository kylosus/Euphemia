import { Collection, time, TimestampStyles, EmbedBuilder, inlineCode } from 'discord.js';
import { ArgConsts, ECommand }                                         from '../../lib/index.js';
import got                                                             from 'got';
import { EmbedError }                                                  from '../../lib/Error/index.js';

const ANILIST_URL = 'https://graphql.anilist.co';

const cache = new Collection();

const fetchAnime = (query, variables) => {
	return got.post(ANILIST_URL, {
		json:         {
			query,
			variables
		},
		responseType: 'json'
	}).json();
};

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['next'],
			description: {
				content:  'Returns remaining time for the next episode of given anime',
				usage:    '[anime title]',
				examples: ['next', 'next Noucome']
			},
			args:        [
				{
					id:          'anime',
					type:        ArgConsts.TYPE.TEXT,
					description: 'Anime title to search',
					optional:    true,
					defaultFunc: () => '*'
				}
			],
			cached:      true,
			guildOnly:   false,
			ownerOnly:   false,
			slash:       true
		});
	}

	async run(message, { anime }) {
		const cached = cache.get(anime.toLowerCase());

		if (cached) {
			if ((cached.Media.nextAiringEpisode?.airingAt ?? 0) * 1000 - Date.now() > 0) {
				return cached;
			}
		}

		const [query, variables] = ((search) => {
			if (!search) {
				return [`{
					Page(perPage: 12) {
						media(type: ANIME status: RELEASING sort:TRENDING_DESC) {
							title { userPreferred }
							nextAiringEpisode { episode airingAt }
						}
					}
				}`, {}];
			}

			return [`query ($search: String) {
					Media(type: ANIME, search: $search, status_in: [RELEASING, NOT_YET_RELEASED]) {
						id
						siteUrl
						episodes
						coverImage { color large }
						title { userPreferred }
						startDate { year month day }
						nextAiringEpisode { episode airingAt }
					}
				}`, {
				search,
			}];
		})(anime === '*' ? null : anime);

		const { data } = await fetchAnime(query, variables).catch(() => {
			throw new EmbedError('Anime not found');
		});

		if (!data.Page) {
			cache.set(anime.toLowerCase(), data);
		}

		return data;
	}

	async shipOne(message, result) {
		const duration = ((a) => {
			if (!a.nextAiringEpisode?.airingAt) {
				if (a.startDate.year) {
					const { month, year } = a.startDate;
					const date            = `${month || '?'}/${year}`;

					return `Some time in the future ${inlineCode(date)}`;
				}

				return 'Some time in the future';
			}

			return time(a.nextAiringEpisode.airingAt, TimestampStyles.RelativeTime);
		})(result);

		const embed = new EmbedBuilder()
			.setColor(result.coverImage.color);

		embed
			.setTitle(result.title.userPreferred)
			.setThumbnail(result.coverImage.large)
			.setURL(result.siteUrl)
			.addFields({
				name:   `Episode ${result.nextAiringEpisode?.episode ?? '1'}/${result.episodes ?? '?'}`,
				value:  duration,
				inline: false
			});

		return message.reply({ embeds: [embed] });
	}

	async shipPage(message, result) {
		const embed = new EmbedBuilder()
			.setColor(this.client.config.COLOR_OK)
			.setTitle('Airing anime schedule');

		result
			.filter(r => r.nextAiringEpisode)
			.sort((a, b) => a.nextAiringEpisode.timeUntilAiring - b.nextAiringEpisode.timeUntilAiring)
			.forEach(r => {
				embed.addFields({
					name:   `${r.title.userPreferred} ${r.nextAiringEpisode?.episode ?? '1'}`,
					value:  time(r.nextAiringEpisode.airingAt, TimestampStyles.RelativeTime),
					inline: true
				});
			});

		return message.reply({ embeds: [embed] });
	}

	async ship(message, result) {
		if (result.Page) {
			return this.shipPage(message, result.Page.media);
		}

		return this.shipOne(message, result.Media);
	}
}
