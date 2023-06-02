import { inlineCode }               from 'discord.js';
import { ECommand }                 from '../../../lib/index.js';
import { subscribeUserTo }          from '../db.js';
import { autocomplete, TagArgType } from './util.js';
import { EmbedError }               from '../../../lib/Error/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['subscribe', 'sub'],
			description: {
				content:  'Subscribes to a tag',
				usage:    '<name>',
				examples: ['subscribe stuff']
			},
			args:        [
				{
					id:          'tag',
					type:        TagArgType,
					description: 'The tag to subscribe to',
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
		return await subscribe({ user: message.author, tagName: tag });
	}
}

export async function subscribe({ user, tagName }) {
	let result = null;

	try {
		result = await subscribeUserTo({
			user,
			tagName
		});
	} catch (err) {
		// Not a great way of handling errors
		if (err.code === 'SQLITE_CONSTRAINT') {
			throw new EmbedError(`You are already in ${inlineCode(tagName)}`);
		}

		throw err;
	}

	if (result.changes === 0) {
		throw new EmbedError(`Tag ${inlineCode(tagName)} not found`);
	}

	return `Subscribed to ${inlineCode(tagName)}`;
}
