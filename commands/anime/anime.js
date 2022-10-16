import { EmbedBuilder, time, TimestampStyles } from 'discord.js';
import { ECommand, ArgConsts }                 from '../../lib/index.js';
import { fetchAnime }                          from './util.js';
import { truncate }                            from 'lodash-es';
import dayjs                                   from 'dayjs';
import duration                                from 'dayjs/plugin/duration.js';
import relativeTime                            from 'dayjs/plugin/relativeTime.js';
import { EmbedError }                          from '../../lib/Error/index.js';

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
				examples: ['anime Clannad']
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
				nextAiringEpisode { episode airingAt }
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
			throw new EmbedError('Anime not found');
		});

		return data.Media;
	}

	async ship(message, result) {
		const embed = new EmbedBuilder()
			.setColor(result.coverImage.color)
			.setTitle(result.title?.userPreferred)
			.setThumbnail(result.coverImage?.large)
			.setDescription(`[AniList](${result?.siteUrl}) | [MyAnimeList](https://myanimelist.net/anime/${result.idMal})`)
			.addFields([
				{ name: 'Average score', value: `${result.averageScore || '-'}%`, inline: true },
				{ name: 'Format', value: _normalizeConstant(result.format || 'Unknown'), inline: true },
				{ name: 'Source', value: _normalizeConstant(result.source || 'Unknown'), inline: true },
				{ name: 'Episodes', value: String(result.episodes || 'Unknown'), inline: true },
			]);

		embed.addFields({
			name:   'Start',
			value:  result.startDate?.month ? dateToTimestamp(result.startDate) : 'Unknown',
			inline: true
		});

		embed.addFields({
			name:   'End',
			value:  result.endDate?.month ? dateToTimestamp(result.endDate) : 'Unknown',
			inline: true
		});

		embed.addFields({ name: 'Status', value: _normalizeConstant(result.status || 'Unknown'), inline: true});


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
			if (result.nextAiringEpisode?.airingAt) {
				return [
					`Next Episode ${result.nextAiringEpisode.episode || '?'}`,
					`${time(result.nextAiringEpisode.airingAt, TimestampStyles.RelativeTime)}`
				];
			}

			const date = result.startDate?.month ? dateToTimestamp(result.startDate, TimestampStyles.RelativeTime) : 'Soon';

			if (result.status === 'FINISHED') {
				return ['Aired', date];
			}

			return ['Will Air', date];
		})();

		embed.addFields({ name: duration[0], value: duration[1], inline: true });

		return message.reply({ embeds: [embed] });
	}
}

function dateToTimestamp({ day = 1, month = 1, year = 1 }, style = TimestampStyles.LongDate) {
	return time(new Date(year, month, day), style);
}

function _normalizeConstant(string) {
	const temp = string.toLowerCase().split('_').join(' ');
	return temp.charAt(0).toUpperCase() + temp.slice(1);
}

function _escapeHTML(string) {
	return string.split('<br>').join(' ').split(/<i>|<\/i>/).join('*').split(/<em>|<\/em>/).join('**');
}
