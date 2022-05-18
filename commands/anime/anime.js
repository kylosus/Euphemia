import { MessageEmbed, Formatters } from 'discord.js';
import { ECommand, ArgConsts }      from '../../lib/index.js';
import { fetchAnime }               from './util.js';
import { truncate }                 from 'lodash-es';
import dayjs                        from 'dayjs';
import duration                     from 'dayjs/plugin/duration.js';
import relativeTime                 from 'dayjs/plugin/relativeTime.js';

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
		const embed = new MessageEmbed()
			.setColor(result.coverImage.color)
			.setTitle(result.title?.userPreferred)
			.setThumbnail(result.coverImage?.large)
			.setDescription(`[AniList](${result?.siteUrl}) | [MyAnimeList](https://myanimelist.net/anime/${result.idMal})`)
			.addField('Average score', `${result.averageScore ?? '-'}%`, true)
			.addField('Popularity', String(result?.popularity), true)
			.addField('Format', _normalizeConstant(result.format) || 'unknown', true)
			.addField('Source', result.source ? _normalizeConstant(result.source) : 'unknown', true)
			.addField('Episodes', String(result.episodes) ?? 'unknown', true)
			.addField('Status', _normalizeConstant(result.status) || 'unknown', true);

		if (result.startDate.month) {
			embed.addField(
				'Start',
				`${result?.startDate.day}/${result?.startDate.month}/${result?.startDate.year}`,
				true
			);
		}

		embed.addField('End', (({ day, month, year }) => {
			if (!month) {
				return 'Still airing';
			}

			return `${day}/${month}/${year}`;
		})(result.endDate), true);

		if (result.genres) {
			embed.addField('Genres', result.genres.slice(0, GENRE_MAX).join('\n'), true);
		}

		if (result.description) {
			embed.addField('Description', _escapeHTML(truncate(result.description, { length: DESC_MAX })));
		}

		const duration = (() => {
			if (result.nextAiringEpisode) {
				const duration = dayjs.duration(result.nextAiringEpisode.timeUntilAiring, 'seconds');
				return ['Next', duration.format('D [days] H [hours] m [minutes]')];
			}

			// this is stupid, just use moment { day: 'whatever' }
			const date         = dayjs(`${result?.startDate.year}${('0' + result?.startDate.month).slice(-2)}${('0' + result?.startDate.day).slice(-2)}`, 'YYYYMMDD');
			const relativeDate = Formatters.time(date.toDate(), Formatters.TimestampStyles.RelativeTime);

			if (result.status === 'FINISHED') {
				return ['Aired', relativeDate];
			}

			return ['Will Air', relativeDate];
		})();

		embed.addField(...duration, true);

		return message.channel.send({ embeds: [embed] });
	}
}

function _normalizeConstant(string) {
	const temp = string.toLowerCase().split('_').join(' ');
	return temp.charAt(0).toUpperCase() + temp.slice(1);
}

function _escapeHTML(string) {
	return string.split('<br>').join(' ').split(/<i>|<\/i>/).join('*').split(/<em>|<\/em>/).join('**');
}
