import { ArgConsts, ECommand } from '../../../lib/index.js';
import { getSubscribedUsers }  from '../db.js';
import { Formatters }          from 'discord.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['tag'],
			description: {
				content:  'Pings a tag',
				usage:    '<name>',
				examples: ['tag stuff']
			},
			args:        [
				{
					id:      'tagName',
					type:    ArgConsts.TYPE.WORD,
					message: 'Please enter a tag name'
				}
			],
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message, { tagName }) {
		const res = await getSubscribedUsers({
			guild: message.guild,
			name:  tagName,
		});

		if (!res.length) {
			throw `Tag ${Formatters.inlineCode(tagName)} not found or empty`;
		}

		return { tagName, users: res.map(r => r.user) };
	}

	async ship(message, { tagName, users }) {
		const body = users.map(Formatters.userMention);
		return message.channel.send({
			content: `🏓 Users subscribed to ${Formatters.inlineCode(tagName)}:\n${body.join('')}`
		});
	}
}
