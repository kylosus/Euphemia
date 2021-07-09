const { MessageEmbed, Permissions } = require('discord.js');
const { ECommand }                  = require('../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['lockdown', 'ld'],
			description:       {
				content:  'Automatically mutes every new member on join.',
				usage:    '',
				examples: ['lockdown'],
			},
			userPermissions:   [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message) {
		const entry = message.client.provider.get(message.guild, 'automute', false);
		await message.client.provider.set(message.guild, 'automute', !entry);

		return `${ entry ? 'Disabled' : 'Enabled' } automute on new member join.`;
	}

	async ship(message, result) {
		return message.channel.send(new MessageEmbed()
			.setColor('DARK_RED')
			.setTitle(result)
		);
	}
};
