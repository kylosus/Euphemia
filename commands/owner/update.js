const { MessageEmbed }          = require('discord.js');
const { ECommand, EmbedLimits } = require('../../lib');
const { spawn }                 = require('child_process');
const _                         = require('lodash');

module.exports = class extends ECommand {
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

		return result;
	}

	ship(message, result) {
		return message.channel.send(new MessageEmbed()
			.setColor('GREEN')
			.setTitle('Result of git pull. Bot may need a restart')
			.setDescription(
				'```' +
				_.truncate(result, { length: EmbedLimits.DESCRIPTION - 6 })
				+ '```'
			)
		);
	}
};
