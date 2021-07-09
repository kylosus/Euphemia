const got                     = require('got');
const { ArgConsts, ECommand } = require('../../../lib');
const db                      = require('../db');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['importcarl'],
			description: {
				content:  'Imports carl database',
				usage:    '<carl exported message id>',
				examples: ['import 861661226827251712']
			},
			args:        [
				{
					id:      'id',
					type:    ArgConsts.ID,
					message: 'Please provide a message id.'
				}
			],
			guildOnly:   true,
			nsfw:        false,
			ownerOnly:   true,
		});
	}

	async run(message, { id }) {
		const carlMessage = await message.channel.messages.fetch(id);

		if (!carlMessage.attachments.size) {
			throw 'No attachments found';
		}

		const { url } = carlMessage.attachments.first();

		const cases = await got.get(url).json();

		const entry = cases.map(c => {
			return {
				guild:     message.guild.id,
				action:    c.action.toUpperCase(),
				moderator: c.moderator_id || 'unknown-carl',
				target:    c.offender_id,
				reason:    c.reason,
				timestamp: c.timestamp
			};
		});

		this.sendNotice(message, `Inserting ${entry.length} entries`);

		await Promise.all(entry.map(e => db.forceInsert(e)));

		return `Inserted ${entry.length} entries`;
	}
};
