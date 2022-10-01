import { EmbedBuilder, time, TimestampStyles } from 'discord.js';
import { ECommand, ArgConsts }                 from '../../lib/index.js';
import { fetchAnime }                          from './util.js';
import { truncate }                            from 'lodash-es';
import dayjs                                   from 'dayjs';
import duration                                from 'dayjs/plugin/duration.js';
import relativeTime                            from 'dayjs/plugin/relativeTime.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const GENRE_MAX = 3;
const DESC_MAX  = 300;

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['anime'],
			description: {
				content:  'Searches for anime on AniList',
				usage:    '[anime title]',
				examples: ['next Clannad']
			},
			args:        [
				{
					id:      'anime',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please enter an anime title'
				}
			],
			cached:      true,
			guildOnly:   false,
			ownerOnly:   false,
			slash:       true
		});
	}

	async run(message, { anime: search }) {
		const query = `query ($search: String) {
			Media(type:ANIME search: $search, sort: SEARCH_MATCH) {
				averageScore
				coverImage { color large }
				description
				duration
				endDate { year month day }
				episodes
				format
				genres
				id
				idMal
				nextAiringEpisode { episode timeUntilAiring }
				popularity
				siteUrl
				source
				status
				startDate { year month day }
				title { userPreferred }
			}
		}`;

		const variables = {
			search
		};

		const { data } = await fetchAnime(query, variables).catch(() => {
			throw 'Anime not found';
		});

		return data.Media;
	}

	async ship(message, result) {
		const embed = new EmbedBuilder()
			.setColor(result.coverImage.color)
			.setTitle(result.title?.userPreferred)
			.setThumbnail(result.coverImage?.large)
			.setDescription(`[AniList](${result?.siteUrl}) | [MyAnimeList](https://myanimelist.net/anime/${result.idMal})`)
			.addFields(
				{ name: 'Average score', value: `${result.averageScore ?? '-'}%`, inline: true },
				{ name: 'Popularity', value: String(result?.popularity), inline: true },
				{ name: 'Format', value: _normalizeConstant(result.format) || 'unknown', inline: true },
				{ name: 'Source', value: result.source ? _normalizeConstant(result.source) : 'unknown', inline: true },
				{ name: 'Episodes', value: String(result.episodes) ?? 'unknown', inline: true },
				{ name: 'Status', value: _normalizeConstant(result.status) || 'unknown', inline: true },
			);

		if (result.startDate.month) {
			embed.addFields({
				name:   'Start',
				value:  `${result?.startDate.day}/${result?.startDate.month}/${result?.startDate.year}`,
				inline: true
			});
		}

		embed.addFields({
			name:   'End',
			value:  (({ day, month, year }) => {
				if (!month) {
					return 'Still airing';
				}

				return `${day}/${month}/${year}`;
			})(result.endDate),
			inline: true
		});

		if (result.genres) {
			embed.addFields({ name: 'Genres', value: result.genres.slice(0, GENRE_MAX).join('\n'), inline: true });
		}

		if (result.description) {
			embed.addFields({
				name:  'Description',
				value: _escapeHTML(truncate(result.description, { length: DESC_MAX }))
			});
		}

		const duration = (() => {
			if (result.nextAiringEpisode) {
				const duration = dayjs.duration(result.nextAiringEpisode.timeUntilAiring, 'seconds');
				return ['Next', duration.format('D [days] H [hours] m [minutes]')];
			}

			// this is stupid, just use moment { day: 'whatever' }
			const date         = dayjs(`${result?.startDate.year}${('0' + result?.startDate.month).slice(-2)}${('0' + result?.startDate.day).slice(-2)}`, 'YYYYMMDD');
			const relativeDate = time(date.toDate(), TimestampStyles.RelativeTime);

			if (result.status === 'FINISHED') {
				return ['Aired', relativeDate];
			}

			return ['Will Air', relativeDate];
		})();

		embed.addFields({ name: duration[0], value: duration[1], inline: true });

		return message.reply({ embeds: [embed] });
	}
}

function _normalizeConstant(string) {
	const temp = string.toLowerCase().split('_').join(' ');
	return temp.charAt(0).toUpperCase() + temp.slice(1);
}

function _escapeHTML(string) {
	return string.split('<br>').join(' ').split(/<i>|<\/i>/).join('*').split(/<em>|<\/em>/).join('**');
}
