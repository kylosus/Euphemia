const {Permissions}			= require('discord.js');
const {ArgConsts, ECommand}	= require('../../lib');

const DELETE_AFTER			= 2000;	// 2 seconds

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['purge', 'p'],
			description: {
				content:	'Purges messages in the channel.',
				usage:		'[amount]',
				examples:	['purge', 'purge 100'],
			},
			userPermissions:	[Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			clientPermissions:	[Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			args: [
				{
					id:			'amount',
					type:		ArgConsts.NUMBER,
					optional:	true,
					default:	() => 1,
				}
			],
			guildOnly: true,
			ownerOnly: false,
			deleteAfter: DELETE_AFTER
		});
	}

	async run(message, {amount}) {
		const deleted = (await message.channel.bulkDelete(amount + 1)).size - 1;
		return `Purged ${deleted} message${deleted > 1 ? 's' : ''}`;
	}
};
