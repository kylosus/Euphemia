import { AutoEmbed, ECommand } from '../../lib/index.js';
import { spawn }               from 'child_process';
import { Formatters }          from 'discord.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['update'],
			description: {
				content:  'Updates the bot without restarting',
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

		return result;
	}

	async ship(message, result) {
		return message.channel.send({
			embeds: [new AutoEmbed()
				.setColor(this.client.config.COLOR_OK)
				.setTitle('Result of git pull')
				.setDescription(`Run ${Formatters.inlineCode('restart')} to restart the bot\n\n${Formatters.codeBlock(result)}`)]
		});
	}
}
