import { Collection, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ECommand }                                      from '../../lib/index.js';

const MAX_ROLES = 30;

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['healthcheck', 'health'],
			description:     {
				content:  'Server health check',
				usage:    '',
				examples: ['healthcheck']
			},
			userPermissions: [PermissionsBitField.Flags.ManageGuild],
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

		health.AdminRoles    = message.guild.roles.cache.filter(r => r.PermissionsBitField.has(PermissionsBitField.FLAGS.ADMINISTRATOR));
		health.ElevatedRoles = message.guild.roles.cache.filter(r => r.PermissionsBitField.has([
			PermissionsBitField.FLAGS.MANAGE_GUILD,
			PermissionsBitField.FLAGS.ManageMessages,
			PermissionsBitField.FLAGS.MANAGE_ROLES,
			PermissionsBitField.FLAGS.BanMembers,
			PermissionsBitField.FLAGS.KICK_MEMBERS,
			PermissionsBitField.FLAGS.DEAFEN_MEMBERS,
			PermissionsBitField.FLAGS.MANAGE_CHANNELS,
			PermissionsBitField.FLAGS.MANAGE_NICKNAMES,
			PermissionsBitField.FLAGS.MENTION_EVERYONE,
			PermissionsBitField.FLAGS.PRIORITY_SPEAKER
		], false));
		health.EmptyRoles    = message.guild.roles.cache.filter(r => !r.members.size);

		return health;
	}

	// By the way, this is kinda very bad. There is no logic in the array trimming (the first() calls)
	// and I just append '...' in all cases. This needs a more comprehensive solution with lodash and
	// so I will replace EmbedBuilder with my own AutoEmbed or SafeEmbed implementation with automatic
	// trims
	async ship(message, { AdminRoles, ElevatedRoles, EmptyRoles }) {
		return message.channel.send({
			embeds: [new EmbedBuilder()
				.setColor(this.client.config.COLOR_OK)
				.setAuthor({
					name:    `${message.guild.name} server health check`,
					iconURL: message.guild.iconURL()
				})
				// .setDescription('Score here')
				.setImage(message.guild.bannerURL())

				.addFields(
					{
						name:  `Roles with Admin permissions (${AdminRoles.size})`,
						value: AdminRoles.first(MAX_ROLES).map(r => `${r.toString()} - ${r.members.size}members`).join('\n') || '~'
					},
					{
						name:  `Roles with other Elevated permissions (${ElevatedRoles.size})`,
						value: ElevatedRoles.first(MAX_ROLES).map(r => `${r.toString()} - ${r.members.size}members`).join('\n') || '~'

					},
					{
						name:  `Empty roles (${EmptyRoles.size})`,
						value: (EmptyRoles.first(MAX_ROLES).map(r => r.toString()).join() + '...') || '~'
					}
				)
			]
		});
	}
}
