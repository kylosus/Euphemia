const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const settings = require('./next-settings.json');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
const request = require('request-promise');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'next',
            group: 'utility',
            memberName: 'next',
            description: 'Returns remaining time for the next episode of given anime. Returns this day\'s schedule, if no anime is specified',
            examples: [`${client.commandPrefix}next Anime Title`, `${client.commandPrefix}next`]
        });
    }

   async run(message) {
       let query, variables = {};
       let args = message.content.split(' ');
       if (args.length < 2) {
            query = `{
                Page(perPage: 100) {
                    media(type: ANIME status: RELEASING sort:POPULARITY_DESC) {
                        title { userPreferred }
                        nextAiringEpisode { episode timeUntilAiring }
                    }
                }
            }`;
        } else {
            query = `query ($search: String, $status: MediaStatus) {
                    Media(type:ANIME status:$status search:$search) {
                        id
                        siteUrl
                        coverImage { medium }
                        title { userPreferred }
                        nextAiringEpisode { episode timeUntilAiring }
                    }
                }`;
            variables = {
                search: args.slice(1).join(' '),
                status: 'RELEASING'
            }
        }

        return execute(query, variables).then(response => {
                return sendResponse(response, message);
        }).catch(() => {
            variables.status = 'NOT_YET_RELEASED';
            return execute(query, variables).then(response => {
                sendResponse(response, message);
            }).catch(() => {
                sendError(message, 'Not found');
            })
        });
    }
}

async function execute(query, variables) {
    var options = {
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

function hasError(response) {
    return response.hasOwnProperty('errors');
}

async function sendError(message, error) {
    return message.embed(new RichEmbed()
        .setColor('RED')
        .addField('Error', error)
    )
} 

async function sendResponse(response, message) {
    let duration;
    let embed = new RichEmbed().setTitle('Today\'s schedule').setURL('http://anichart.net').setColor('GREEN');
    if (response.data.hasOwnProperty('Page')) {
        response.data.Page.media
            .filter(a => a.nextAiringEpisode && a.nextAiringEpisode.timeUntilAiring < 82800)
            .sort((a, b) => a.nextAiringEpisode.timeUntilAiring - b.nextAiringEpisode.timeUntilAiring)
            .forEach(anime => {
                duration = moment.duration(anime.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours] m [minutes] s [seconds]');
                embed.addField(`${anime.title.userPreferred} ${anime.nextAiringEpisode? (anime.nextAiringEpisode.episode || '') : '?'}`, duration, false);
            });

        if (embed.fields.length < 1) {
            return sendError(message, 'No anime scheduled for today.');
        }

        return message.embed(embed);

    } else {
        let anime = response.data.Media;

        if (anime.nextAiringEpisode) {
            duration = moment.duration(anime.nextAiringEpisode.timeUntilAiring, 'seconds');
            duration = duration.format('D [days] H [hours] m [minutes] s [seconds]');   
        } else {
            duration = 'unknown';
            embed.setColor('ORANGE');
        }

        embed
            .setTitle(`${anime.title.userPreferred} ${anime.nextAiringEpisode? (anime.nextAiringEpisode.episode || '-') : '?'}`)
            .setThumbnail(anime.coverImage.medium)
            .setTitle(anime.title.userPreferred, anime.siteUrl)
            .setURL(anime.siteUrl)
            .addField(`Next episode ${anime.nextAiringEpisode? (anime.nextAiringEpisode.episode || '-') : '?'} in`, duration, false)

        if (anime.id in settings) { 
            embed.setColor(settings[anime.id]);
        }

        return message.embed(embed);
    }
}