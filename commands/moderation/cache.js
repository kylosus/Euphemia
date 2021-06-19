const { Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

module.exports = class extends ECommand {
	constructor(client) {

		super(client, {
			aliases: ['cache'],
			description: {
				content: 'Caches messages in a channel',
				usage: 'cache [channel]',
				examples: ['cache', 'cache #general']
			},
			userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
			clientPermissions: [Permissions.FLAGS.READ_MESSAGE_HISTORY],
			args: [
				{
					id: 'channel',
					type: ArgConsts.CHANNEL,
					default: m => m.channel
				},
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: true,
			rateLimited: false,
			fetchMembers: false,
			cached: false,
		});
	}

	async run(message, args) {
		await args.channel.messages.fetch({limit: 100});
		return new Promise(resolve => resolve('👌'));
	}
};
