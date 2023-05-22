import { ECommand } from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['resetcommands'],
			description: {
				content:  'Resets application commands. Will need a restart to reload',
				usage:    '',
				examples: ['resetcommands']
			},
			guildOnly:   false,
			ownerOnly:   true,
		});
	}

	async run(message, { code }) {
		await this.client.application.commands.set([]);
		await this.client.application.commands.set([], message?.guild?.id);

		return '👌';
	}
}
