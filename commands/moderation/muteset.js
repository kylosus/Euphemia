import { Permissions }                   from 'discord.js';
import { ArgConsts, ECommand }           from '../../lib/index.js';
import { setMutedRole, setNewMutedRole } from '../../modules/mute/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['muteset'],
			description:       {
				content:  'Sets muted role for the server',
				usage:    '[role]',
				examples: ['muteset', 'muteset Some role', 'muteset 422621940868579338']
			},
			userPermissions:   [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_GUILD],
			args:              [
				{
					id:       'role',
					type:     ArgConsts.TYPE.ROLE_LOOSE,
					optional: true,
					default:  () => null
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { role }) {
		if (!role) {
			const role = await setNewMutedRole(message.guild);
			return `Created new muted role ${role.toString()}`;
		}

		if (role.position >= message.guild.me.roles.highest.position) {
			throw 'Cannot assign as the muted role. Role is too high in the hierarchy';
		}

		await setMutedRole(message.guild, role);

		return `Set ${role.toString()} as the muted role`;
	}
}
