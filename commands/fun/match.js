import { EmbedBuilder, inlineCode } from 'discord.js';
import { ArgConsts, ECommand }      from '../../lib/index.js';
import crypto                       from 'node:crypto';
import { idExtract, userIdRegex }   from '../../lib/Argument/ArgumentTypeConstants.js';
import { EmbedError }               from '../../lib/Error/index.js';

const MAX_MATCH = 100;
const ME        = '275331662865367040';
const COLOR     = '#F8C8DC';

const EMOTES = [
	'💔', //low
	'💓💓',   // med
	'💞💞💞💞',   // high
];

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['match'],
			description: {
				content:  'Shows how well you match',
				usage:    '',
				examples: ['match @jokersus']
			},
			args:        [
				{
					id:      'user',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please mention someone to match with'
				}
			],
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message, { user }) {
		// hehe
		if (message.author.id === ME && user.toLowerCase() === 'pablo escobar') {
			return { user, match: 1000 };
		}

		const error = new EmbedError('Please mention someone to match with');

		const idMention = user.match(userIdRegex) || (() => { throw error; })();
		const idRaw     = idExtract(idMention)[0];

		const member = await message.guild.members.fetch(idRaw).catch(() => { throw error; });

		const match = parseInt(
			crypto.createHash('md5').update(message.author.id + member.user.id).digest('hex'),
			16
		) % MAX_MATCH;

		return { user: member, match };
	}

	async ship(message, { user, match }) {
		const matchEmotes = EMOTES[Math.floor(match / (MAX_MATCH / EMOTES.length))] || '💜💜💜💜💜💜💜💜💜💜💜';

		return message.channel.send({
			embeds: [new EmbedBuilder()
				.setColor(COLOR)
				.setDescription(`${matchEmotes}\nThe match between ${message.author} and ${user} is ${inlineCode(match)}`)
			]
		});
	}
}
