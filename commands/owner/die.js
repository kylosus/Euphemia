import { ArgConsts, ECommand } from '../../lib/index.js';
import process                 from 'node:process';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['die', 'shutdown'],
			description: {
				content:  'Shuts down the bot',
				usage:    '[exit code]',
				examples: ['die', 'die 1']
			},
			args:        [
				{
					id:          'code',
					type:        ArgConsts.TYPE.NUMBER,
					optional:    true,
					defaultFunc: () => 0,
				},
			],
			guildOnly:   false,
			ownerOnly:   true,
		});
	}

	async run(message, { code }) {
		await this.sendNotice(message, '👋');
		process.exit(code);
	}
}
