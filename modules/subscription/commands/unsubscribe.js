import { Formatters }          from 'discord.js';
import { ArgConsts, ECommand } from '../../../lib/index.js';
import { unsubscribeUserFrom } from '../db.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['unsubscribe', 'unsub'],
			description: {
				content:  'Unsubscribes from a tag',
				usage:    '<name>',
				examples: ['unsubscribe stuff']
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
		return unsubscribe({
			guild: message.guild,
			user:  message.author,
			tagName
		});
	}
}

export async function unsubscribe({ guild, user, tagName }) {
	const result = await unsubscribeUserFrom({
		guild,
		user,
		tagName
	});

	if (result.changes === 0) {
		throw `Tag ${Formatters.inlineCode(tagName)} not found or you are not subscribed to it`;
	}

	return `Unsubscribed from ${Formatters.inlineCode(tagName)}`;
}
