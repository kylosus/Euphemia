const { Collection, MessageEmbed, Permissions } = require('discord.js');
const { ECommand }                              = require('../../lib');

const MAX_ROLES = 30;

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['healthcheck', 'health'],
			description:     {
				content:  'Server health check',
				usage:    '',
				examples: ['healthcheck']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			guildOnly:       true,
			ownerOnly:       false,
			typing:          true
		});
	}

	async run(message) {
		const health = {
			AdminRoles:    new Collection(),
			ElevatedRoles: new Collection(),
			EmptyRoles:    new Collection()
		};

		health.AdminRoles    = message.guild.roles.cache.filter(r => r.permissions.has(Permissions.FLAGS.ADMINISTRATOR));
		health.ElevatedRoles = message.guild.roles.cache.filter(r => r.permissions.has([
			Permissions.FLAGS.MANAGE_GUILD,
			Permissions.FLAGS.MANAGE_MESSAGES,
			Permissions.FLAGS.MANAGE_ROLES,
			Permissions.FLAGS.BAN_MEMBERS,
			Permissions.FLAGS.KICK_MEMBERS,
			Permissions.FLAGS.DEAFEN_MEMBERS,
			Permissions.FLAGS.MANAGE_CHANNELS,
			Permissions.FLAGS.MANAGE_NICKNAMES,
			Permissions.FLAGS.MENTION_EVERYONE,
			Permissions.FLAGS.PRIORITY_SPEAKER
		], false));
		health.EmptyRoles    = message.guild.roles.cache.filter(r => !r.members.size);

		return health;
	}

	// By the way, this is kinda very bad. There is no logic in the array trimming (the first() calls)
	// and I just append '...' in all cases. This needs a more comprehensive solution with lodash and
	// so I will replace MessageEmbed with my own AutoEmbed or SafeEmbed implementation with automatic
	// trims
	async ship(message, { AdminRoles, ElevatedRoles, EmptyRoles }) {
		return message.channel.send(new MessageEmbed()
			.setColor('GREEN')
			.setAuthor(`${message.guild.name} server health check`, message.guild.iconURL())
			// .setDescription('Score here')
			.setImage(message.guild.bannerURL())
			.addField(
				`Roles with Admin permissions (${AdminRoles.size})`,
				AdminRoles.first(MAX_ROLES).map(r => `${r.toString()} - ${r.members.size}members`).join('\n') || '~'
			)
			.addField(
				`Roles with other Elevated permissions (${ElevatedRoles.size})`,
				ElevatedRoles.first(MAX_ROLES).map(r => `${r.toString()} - ${r.members.size}members`).join('\n') || '~'
			)
			.addField(
				`Empty roles (${EmptyRoles.size})`,
				(EmptyRoles.first(MAX_ROLES).map(r => r.toString()).join() + '...') || '~'
			)
		);
	}
};
