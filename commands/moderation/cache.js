const {Permissions}			= require('discord.js');
const {ArgConsts, ECommand}	= require('../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['cache'],
			description: {
				content:	'Caches messages in a channel',
				usage:		'cache [channel]',
				examples:	['cache', 'cache #general']
			},
			userPermissions:	[Permissions.FLAGS.ADMINISTRATOR],
			clientPermissions:	[Permissions.FLAGS.READ_MESSAGE_HISTORY],
			args: [
				{
					id: 		'channel',
					type:		ArgConsts.CHANNEL,
					default:	m => m.channel
				},
			],
			guildOnly: true,
			ownerOnly: true,
		});
	}

	async run(message, {channel}) {
		await channel.messages.fetch({limit: 100});
		return '👌';
	}
};
