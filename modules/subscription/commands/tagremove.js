import { inlineCode, PermissionsBitField } from 'discord.js';
import { ECommand }                        from '../../../lib/index.js';
import { disableTag, searchTag }           from '../db.js';
import { autocomplete, TagArgType }        from './util.js';
import { EmbedError }                      from '../../../lib/Error/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['tagremove', 'removetag', 'deltag', 'tagdel', 'tagdelete', 'deletetag'],
			description:     {
				content:  'Removes a tag',
				usage:    '<name>',
				examples: ['tagremove stuff']
			},
			userPermissions: [PermissionsBitField.Flags.ManageRoles],
			args:            [
				{
					id:           'tag',
					type:         TagArgType,
					description:  'The tag to remove',
					message:      'Please enter a tag name',
					autocomplete: autocomplete(searchTag)
				}
			],
			guildOnly:       true,
			ownerOnly:       false,
			slash:           true
		});
	}

	async run(message, { tag }) {
		let removed = null;

		try {
			removed = disableTag({
				guild: message.guild,
				name:  tag,
			});
		} catch (error) {
			// Not a great way of handling errors
			if (error.code === 'SQLITE_CONSTRAINT') {
				throw new EmbedError(`Tag ${inlineCode(tag)} already exists`);
			}

			throw error;
		}

		if (removed.changes === 0) {
			throw new EmbedError(`Tag ${inlineCode(tag)} not found`);
		}

		return `Removed tag ${inlineCode(tag)}`;
	}
}
