const { Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['purge', 'p'],
			description: {
				content: 'Purges messages in the channel.',
				usage: '[amount]',
				examples: ['purge', 'purge 100'],
			},
			userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			clientPermissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			args: [
				{
					id: 'amount',
					type: ArgConsts.NUMBER,
					optional: true,
					default: () => 1,
				}
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
			rateLimited: false,
			fetchMembers: false,
			cached: false,
			deleteAfter: 2000
		});
	}

	async run(message, args) {
		const deleted = await message.channel.bulkDelete(args.amount + 1);
		return `Purged ${deleted.size - 1} messages`;
	}
};
