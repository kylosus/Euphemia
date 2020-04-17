const { Command }	= require('discord.js-commando');
const { RichEmbed } = require('discord.js');

const moment		= require('moment');
const request		= require('request-promise');
const { to }		= require('await-to-js');

const ONE_DAY		= 82800;


module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'next',
			group: 'anime',
			memberName: 'next',
			description: 'Returns remaining time for the next episode of given anime.',
			details: 'Returns remaining time for the next episode of given anime. Returns this day\'s schedule, if no anime is specified',
			examples: [`${client.commandPrefix}next Anime Title`, `${client.commandPrefix}next`]
		});
	}


	async run(message, arg) {
		const [query, variables] = ((search) => {
			if (!search.length) {
				return [`{
					Page(perPage: 100) {
						media(type: ANIME status: RELEASING sort:SEARCH_MATCH) {
							title { userPreferred }
							nextAiringEpisode { episode timeUntilAiring }
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
						nextAiringEpisode { episode timeUntilAiring }
					}
				}`, {
				search,
				status: 'RELEASING'
			}];
		})(arg);

		let err, res;
		[err, res] = await to(execute(query, variables));

		if (!err) {
			return message.channel.send(parseEmbed(parseResponse(res)));
		}

		variables.status = 'NOT_YET_RELEASED';
		[err, res] = await to(execute(query, variables));

		if (!err) {
			return message.channel.send(parseEmbed(parseResponse(res)));
		}

		return message.channel.send(new RichEmbed()
			.setColor('RED')
			.setTitle('Not found')
		);
	}
};

async function execute(query, variables) {
	const options = {
		method: 'POST',
		uri: 'https://graphql.anilist.co',
		body: {
			query: query,
			variables: variables
		},
		json: true
	};

	return request(options);
}

function parseResponse(response) {
	if (response.data.hasOwnProperty('Page')) {
		response.data.Page.media
			.filter(a => a.nextAiringEpisode && a.nextAiringEpisode.timeUntilAiring < ONE_DAY)
			.sort((a, b) => a.nextAiringEpisode.timeUntilAiring - b.nextAiringEpisode.timeUntilAiring)
			.map(a => ({
				title: a.title.userPreferred,
				isNext: a.nextAiringEpisode,
				next: a.episode,
				duration: moment.duration(a.nextAiringEpisode.timeUntilAiring, 'seconds')
					.format('D [days] H [hours] m [minutes] s [seconds]')
			}));
	}

	const anime = response.data.Media;

	const duration = ((a) => {
		if (!a.nextAiringEpisode) {
			return 'unknown';
		}

		return moment.duration(a.nextAiringEpisode.timeUntilAiring, 'seconds')
			.format('D [days] H [hours] m [minutes] s [seconds]');
	})(anime);

	return [{
		title: anime.title.userPreferred,
		cover: anime.coverImage.medium,
		url: anime.siteUrl,
		isNext: anime.nextAiringEpisode,
		next: anime.episode,
		duration
	}];
}

function parseEmbed(anime) {
	const embed = new RichEmbed()
		.setColor('GREEN');

	if (anime.length === 1) {
		return embed
			.setTitle(`${anime.title} ${anime.isNext ? (anime.next || '-') : '?'}`)
			.setThumbnail(anime.cover)
			.setTitle(anime.title)
			.setURL(anime.url)
			.addField(`Episode ${anime.isNext ? (anime.next || '-') : '?'} in`, anime.duration, false);
	}

	anime.forEach(a => {
		embed.addField(`${a.title} ${a.isNext ? (a.next || '') : '?'}`, a.duration, false);
	});

	return embed;
}