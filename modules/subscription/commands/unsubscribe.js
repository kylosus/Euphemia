import { inlineCode }               from 'discord.js';
import { ECommand }                 from '../../../lib/index.js';
import { unsubscribeUserFrom }      from '../db.js';
import { autocomplete, TagArgType } from './util.js';
import { EmbedError }               from '../../../lib/Error/index.js';

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
					id:          'tag',
					type:        TagArgType,
					description: 'The tag to unsubscribe from',
					message:     'Please enter a tag name',
					autocomplete
				}
			],
			guildOnly:   true,
			ownerOnly:   false,
			slash:       true
		});
	}

	async run(message, { tag }) {
		return unsubscribe({
			guild:   message.guild,
			user:    message.author,
			tagName: tag
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
		throw new EmbedError(`You are not subscribed to ${inlineCode(tagName)}`);
	}

	return `Unsubscribed from ${inlineCode(tagName)}`;
}
