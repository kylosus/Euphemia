import { AutoEmbed, ECommand } from '../../lib/index.js';
import { spawn }               from 'child_process';
import process                 from 'node:process';

const EXIT_TIMEOUT = 5000;

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['update'],
			description: {
				content:  'Updates the bot and restarts',
				usage:    '',
				examples: ['update']
			},
			guildOnly:   false,
			ownerOnly:   true,
		});
	}

	async run() {
		const git = spawn('git', ['pull']);

		let result = '';
		for await (const chunk of git.stdout) {
			result += chunk;
		}

		let error = '';
		for await (const chunk of git.stderr) {
			console.error('stderr chunk: ' + chunk);
			error += chunk;
		}

		const exitCode = await new Promise(resolve => {
			git.on('close', resolve);
		});

		if (exitCode) {
			throw error;
		}

		process.on('exit', () => {
			spawn(process.argv.shift(), process.argv, {
				cwd:      process.cwd(),
				detached: true,
				stdio:    'inherit'
			});
		});

		setTimeout(() => {
			process.exit(0);
		}, EXIT_TIMEOUT);

		return result;
	}

	async ship(message, result) {
		return message.channel.send({
			embeds: [new AutoEmbed()
				.setColor(this.client.config.COLOR_OK)
				.setTitle(`Result of git pull. Attempting restart in ${EXIT_TIMEOUT / 1000} seconds...`)
				.setDescriptionWrap(result)]
		});
	}
}
