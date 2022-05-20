import { Collection, Formatters, MessageEmbed } from 'discord.js';
import { ArgConsts, ECommand }                  from '../../lib/index.js';
import got                                      from 'got';
import dayjs                                    from 'dayjs';

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
					id:       'anime',
					type:     ArgConsts.TYPE.TEXT,
					optional: true,
					default:  () => '*'
				}
			],
			cached:      true,
			guildOnly:   false,
			ownerOnly:   false,
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
						coverImage { color medium }
						title { userPreferred }
						startDate { year month day }
						nextAiringEpisode { episode airingAt }
					}
				}`, {
				search,
			}];
		})(anime === '*' ? null : anime);

		const { data } = await fetchAnime(query, variables).catch(() => {
			throw 'Anime not found';
		});

		if (!data.Page) {
			cache.set(anime.toLowerCase(), data);
		}

		return data;
	}

	async shipOne(message, result) {
		const duration = ((a) => {
			if (!a.nextAiringEpisode?.airingAt) {
				const duration = dayjs(`${a.startDate.year ?? '-'}-${a.startDate.month}-${a.startDate.day}`);

				if (duration.isValid()) {
					return Formatters.time(duration.unix(), Formatters.TimestampStyles.LongDate);
				}

				return 'Some time in the future';
			}

			return Formatters.time(a.nextAiringEpisode.airingAt, Formatters.TimestampStyles.RelativeTime);
		})(result);

		const embed = new MessageEmbed()
			.setColor(result.coverImage.color);

		embed
			.setTitle(result.title.userPreferred)
			.setThumbnail(result.coverImage.medium)
			.setURL(result.siteUrl)
			.addField(`Episode ${result.nextAiringEpisode?.episode ?? '1'}/${result.episodes ?? '?'} in`, duration, false);

		return message.channel.send({ embeds: [embed] });
	}

	async shipPage(message, result) {
		const embed = new MessageEmbed()
			.setColor(this.client.config.COLOR_OK)
			.setTitle('Airing anime schedule');

		result
			.filter(r => r.nextAiringEpisode)
			.sort((a, b) => a.nextAiringEpisode.timeUntilAiring - b.nextAiringEpisode.timeUntilAiring)
			.forEach(r => {
				embed.addField(
					`${r.title.userPreferred} ${r.nextAiringEpisode?.episode ?? '1'}`,
					Formatters.time(r.nextAiringEpisode.airingAt, Formatters.TimestampStyles.RelativeTime),
					true
				);
			});

		return message.channel.send({ embeds: [embed] });
	}

	async ship(message, result) {
		if (result.Page) {
			return this.shipPage(message, result.Page.media);
		}

		return this.shipOne(message, result.Media);
	}
}

