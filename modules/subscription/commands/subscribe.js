import { inlineCode }      from 'discord.js';
import { ECommand }        from '../../../lib/index.js';
import { subscribeUserTo } from '../db.js';
import { TagArgType }      from './util.js';
import { EmbedError }      from '../../../lib/Error/index.js';

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
					id:      'tagName',
					type:    TagArgType,
					message: 'Please enter a tag name'
				}
			],
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message, { tagName }) {
		return await subscribe({ user: message.author, tagName });
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
