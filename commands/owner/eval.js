const _ = require('lodash');

const { MessageEmbed, Permissions } = require('discord.js');

const {ArgConsts, ECommand, EmbedLimits} = require('../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['eval'],
			description: {
				content: 'Evaluates JavaScript code',
				usage: '<code>',
				examples: ['eval 1 + 1', 'eval message.delete()']
			},
			userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
			args: [
				{
					id: 'code',
					type: ArgConsts.TEXT,
					message: 'Please provide code'
				}
			],
			guildOnly: false,
			nsfw: false,
			ownerOnly: true,
		});
	}

	async run(message, {code}) {
		const start = process.hrtime();
		const result = await eval(
			`(async () => {
				return ${code}
			})();`
		);
		const elapsed = process.hrtime(start)[1] / 1000000;	// millisecond

		return [elapsed, result];
	}

	makeError(string) {
		return new MessageEmbed()
			.setColor('RED')
			.setTitle('Error while evaluating:')
			.setDescription('```' + string + '```');
	}

	async ship(message, [elapsed, result]) {
		return message.channel.send(new MessageEmbed()
			.setColor('GREEN')
			.setTitle(`Evaluated in ${elapsed}ms.`)
			// .setDescription('```' + _(JSON.stringify(result, null, 4)).truncate(EmbedLimits.DESCRIPTION - 6) + '```')
			.setDescription('```' + _.truncate(JSON.stringify(result, null, 4), { length: EmbedLimits.DESCRIPTION - 6}) + '```')
		);
	}
};
