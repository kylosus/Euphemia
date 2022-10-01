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
			fetchMembers:    true,
			ownerOnly:       false,
			typing:          true,
			slash:           true,
			defer:           true
		});
	}

	async run(message) {
		const health = {
			AdminRoles:    new Collection(),
			ElevatedRoles: new Collection(),
			EmptyRoles:    new Collection()
		};

		health.AdminRoles    = message.guild.roles.cache.filter(r => r.permissions.any(PermissionsBitField.Flags.Administrator));
		health.ElevatedRoles = message.guild.roles.cache.filter(r => r.permissions.any([
			PermissionsBitField.Flags.ManageGuild,
			PermissionsBitField.Flags.ManageMessages,
			PermissionsBitField.Flags.ManageRoles,
			PermissionsBitField.Flags.BanMembers,
			PermissionsBitField.Flags.KickMembers,
			PermissionsBitField.Flags.DeafenMembers,
			PermissionsBitField.Flags.ManageChannels,
			PermissionsBitField.Flags.ManageNicknames,
			PermissionsBitField.Flags.MentionEveryone,
			PermissionsBitField.Flags.PrioritySpeaker
		], false));
		health.EmptyRoles    = message.guild.roles.cache.filter(r => !r.members.size);

		return health;
	}

	// By the way, this is kinda very bad. There is no logic in the array trimming (the first() calls)
	// and I just append '...' in all cases. This needs a more comprehensive solution with lodash and
	// so I will replace EmbedBuilder with my own AutoEmbed or SafeEmbed implementation with automatic
	// trims
	async ship(message, { AdminRoles, ElevatedRoles, EmptyRoles }) {
		return message.reply({
			embeds: [new EmbedBuilder()
				.setColor(this.client.config.COLOR_OK)
				.setAuthor({
					name:    `${message.guild.name} server health check`,
					iconURL: message.guild.iconURL()
				})
				// .setDescription('Score here')

				.setThumbnail(message.guild.iconURL({ size: 4096 }))
				.setImage(message.guild.bannerURL({ size: 4096 }))

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
