const { Collection, MessageEmbed } = require('discord.js');
const { ArgConsts, ECommand }      = require('../../lib');
const got                          = require('got');
const moment                       = require('moment'); require('moment-duration-format');

const cache = new Collection();

// const ONE_DAY     = 82800;
const ANILIST_URL = 'https://graphql.anilist.co';

const fetchAnime = (query, variables) => {
	return got.post(ANILIST_URL, {
		json:         {
			query,
			variables
		},
		responseType: 'json'
	}).json();
};

module.exports = class extends ECommand {
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
					type:     ArgConsts.TEXT,
					optional: true,
					default: () => '*'
				}
			],
			guildOnly:   false,
			ownerOnly:   false,
			typing:      true
		});
	}

	async run(message, { anime }) {
		const cached = cache.get(anime.toUpperCase());

		if (cached) {
			if (cached.Media.nextAiringEpisode.airingAt * 1000 - Date.now() > 0) {
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

			return [`query ($search: String, $status: MediaStatus) {
					Media(type:ANIME status:$status search:$search) {
						id
						siteUrl
						coverImage { medium }
						title { userPreferred }
						nextAiringEpisode { episode airingAt }
					}
				}`, {
				search,
				status: 'RELEASING'
			}];
		})(anime === '*' ? null : anime);

		const { data } = await fetchAnime(query, variables).catch(() => {
			// There has to be a better way, man
			variables.status = 'NOT_YET_RELEASED';
			return fetchAnime(query, variables).catch(() => {throw 'Anime not found';});
		});

		if (!data.Page) {
			cache.set(anime.toUpperCase(), data);
		}

		return data;
	}

	async shipOne(message, result) {
		const duration = ((a) => {
			if (!a.nextAiringEpisode) {
				return 'Some time in the future';
			}

			return moment.duration(moment(a.nextAiringEpisode.airingAt * 1000).diff(moment()))
				.format('D [days] H [hours] m [minutes] s [seconds]');
		})(result);

		const embed = new MessageEmbed()
			.setColor('GREEN');

		embed
			.setTitle(`${result.title} ${result.nextAiringEpisode?.episode ?? '?'}`)
			.setThumbnail(result.coverImage.medium)
			.setTitle(result.title.userPreferred)
			.setURL(result.siteUrl)
			.addField(`Episode ${result.nextAiringEpisode?.episode ?? '?'} in`, duration, false);

		return message.channel.send(embed);
	}

	async shipPage(message, result) {
		const embed = new MessageEmbed()
			.setColor('GREEN')
			.setTitle('Airing anime schedule');

		result
			.filter(r => r.nextAiringEpisode)
			.sort((a, b) => a.nextAiringEpisode.timeUntilAiring - b.nextAiringEpisode.timeUntilAiring)
			.forEach(r => embed.addField(
				`${r.title.userPreferred} ${r.nextAiringEpisode?.episode ?? '?'}`,
				moment.duration(moment(r.nextAiringEpisode.airingAt * 1000).diff(moment()))
					.format('D [days] H [hours] m [minutes] s [seconds]'),
				true)
			);

		return message.channel.send(embed);
	}

	async ship(message, result) {
		if (result.Page) {
			return this.shipPage(message, result.Page.media);
		}

		return this.shipOne(message, result.Media);
	}
};