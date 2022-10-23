import { PermissionsBitField }           from 'discord.js';
import { ArgConsts, ECommand }           from '../../lib/index.js';
import { setMutedRole, setNewMutedRole } from '../../modules/mute/index.js';
import { EmbedError }                    from '../../lib/Error/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['muteset', 'setmute'],
			description:       {
				content:  'Sets muted role for the server',
				usage:    '[role]',
				examples: ['muteset', 'muteset Some role', 'muteset 422621940868579338']
			},
			userPermissions:   [PermissionsBitField.Flags.ManageRoles],
			clientPermissions: [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageGuild],
			args:              [
				{
					id:          'role',
					type:        ArgConsts.TYPE.ROLE_LOOSE,
					description: 'The muted role',
					optional:    true,
					defaultFunc: () => null
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
			slash:             true
		});
	}

	async run(message, { role }) {
		if (!role) {
			const role = await setNewMutedRole(message.guild);
			return `Created new muted role ${role.toString()}`;
		}

		if (role.position >= message.guild.members.me.roles.highest.position) {
			throw new EmbedError('Cannot assign as the muted role. Role is too high in the hierarchy');
		}

		await setMutedRole(message.guild, role);

		return `Set ${role.toString()} as the muted role`;
	}
}
