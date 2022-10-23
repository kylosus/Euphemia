import { ArgConsts, ECommand } from '../../lib/index.js';
import { spawn }               from 'child_process';
import process                 from 'node:process';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['restart'],
			description: {
				content:  'Restarts the bot. Be careful when using with pm2 and other managers/autostart scripts',
				usage:    '[exit code]',
				examples: ['restart', 'restart 1']
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
		process.on('exit', () => {
			spawn(process.argv.shift(), process.argv, {
				cwd:      process.cwd(),
				detached: true,
				stdio:    'inherit'
			});
		});

		await this.sendNotice(message, '👌');

		process.exit(code);
	}
}
