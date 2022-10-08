import { ArgConsts, ECommand } from '../../../lib/index.js';
import { forceInsert }         from '../db.js';
import got                     from 'got';
import { EmbedError }          from '../../../lib/Error/index.js';

const CARL_ID = '235148962103951360';

export default class extends ECommand {
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
					id:          'id',
					type:        ArgConsts.TYPE.ID,
					description: 'The message ID with carlbot attachment',
					message:     'Please provide a message id.'
				}
			],
			guildOnly:   true,
			nsfw:        false,
			ownerOnly:   true,
			slash:       true
		});
	}

	async run(message, { id }) {
		const carlMessage = await message.channel.messages.fetch({ message: id });

		if (!carlMessage.attachments.size) {
			throw new EmbedError('No attachments found');
		}

		const { url } = carlMessage.attachments.first();

		const cases = await got.get(url).json();

		const entry = cases.map(c => {
			return {
				guild:     message.guild.id,
				action:    c.action.toUpperCase(),
				moderator: c.moderator_id || CARL_ID,
				target:    c.offender_id,
				reason:    c.reason,
				passed:    true,
				timestamp: c.timestamp
			};
		});

		this.sendNotice(message, `Inserting ${entry.length} entries`).catch(() => {
		});

		// Should probably use a transaction
		await Promise.all(entry.map(e => forceInsert(e)));

		return `Inserted ${entry.length} entries`;
	}
}
