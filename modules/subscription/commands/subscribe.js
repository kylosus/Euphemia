import { Formatters }          from 'discord.js';
import { ArgConsts, ECommand } from '../../../lib/index.js';
import { subscribeUserTo }     from '../db.js';

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
					type:    ArgConsts.TYPE.WORD,
					message: 'Please enter a tag name'
				}
			],
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message, { tagName }) {
		let result = null;

		try {
			result = await subscribeUserTo({
				user: message.author,
				tagName
			});
		} catch (err) {
			// Not a great way of handling errors
			if (err.code === 'SQLITE_CONSTRAINT') {
				throw `You are already in ${Formatters.inlineCode(tagName)}`;
			}

			throw err;
		}

		if (result.changes === 0) {
			throw `Tag ${Formatters.inlineCode(tagName)} not found`;
		}

		return `Subscribed to ${Formatters.inlineCode(tagName)}`;
	}
}
