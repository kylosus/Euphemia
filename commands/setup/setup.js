import { Permissions } from 'discord.js';
import { ECommand }    from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			actionName:      'setup',
			aliases:         ['setup'],
			description:     {
				content:  'Sets up guild settings',
				usage:    '',
				examples: ['setup'],
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			guildOnly:       true,
			ownerOnly:       false,
			disabled:        true
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message) {
		// set up log channels
		// set up muted role
		return ':)';
	}
}
