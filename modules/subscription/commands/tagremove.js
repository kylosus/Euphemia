import { Formatters, Permissions } from 'discord.js';
import { ArgConsts, ECommand }     from '../../../lib/index.js';
import { disableTag }              from '../db.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['tagremove'],
			description:     {
				content:  'Adds a new tag',
				usage:    '<name>',
				examples: ['tagremove stuff']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			args:            [
				{
					id:      'tagName',
					type:    ArgConsts.TYPE.WORD,
					message: 'Please enter a tag name'
				}
			],
			guildOnly:       true,
			ownerOnly:       false
		});
	}

	async run(message, { tagName }) {
		let removed = null;

		try {
			removed = disableTag({
				guild: message.guild,
				name:  tagName,
			});
		} catch (error) {
			// Not a great way of handling errors
			if (error.code === 'SQLITE_CONSTRAINT') {
				throw `Tag ${Formatters.inlineCode(tagName)} already exists`;
			}

			throw error;
		}

		if (removed.changes === 0) {
			throw `Tag ${Formatters.inlineCode(tagName)} not found`;
		}

		return `Removed tag ${Formatters.inlineCode(tagName)}`;
	}
}
