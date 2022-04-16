import { Formatters }          from 'discord.js';
import { ArgConsts, ECommand } from '../../../lib/index.js';
import { createTag }           from '../db.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['tagadd'],
			description: {
				content:  'Adds a new tag',
				usage:    '<name>',
				examples: ['tagadd stuff']
			},
			args:        [
				{
					id:       'tagName',
					type:     ArgConsts.TYPE.WORD,
					message:  'Please enter a tag name'
				}
			],
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message, { tagName }) {
		try {
			await createTag({
				guild:   message.guild,
				name:    tagName,
				creator: message.author
			});
		} catch (error) {
			// Not a great way of handling errors
			if (error.code === 'SQLITE_CONSTRAINT') {
				throw `Tag ${Formatters.inlineCode(tagName)} already exists`;
			}

			throw error;
		}

		return `Created tag ${Formatters.inlineCode(tagName)}`;
	}
}
