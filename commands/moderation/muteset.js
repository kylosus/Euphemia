const { Permissions }         = require('discord.js');
const { ArgConsts, ECommand } = require('../../lib');
const { mutedRole }           = require('../../modules/mute');

module.exports = class extends ECommand {
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
					type:     ArgConsts.TEXT,
					optional: true,
					default:  () => null
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { role: _role }) {
		if (!_role) {
			const role = await mutedRole.setNewMutedRole(message.guild);
			return `Created new muted role ${ role.toString() }`;
		}

		const role = await (async (role) => {
			return message.guild.roles.cache.get(role) ||
				message.guild.roles.cache.find(r => r.name.toLowerCase() === role.toLowerCase()) ||
				message.guild.roles.cache.find(r => r.name.toLowerCase().startsWith(role.toLowerCase())) ||
				(() => {
					throw 'Role not found';
				})();
		})(_role);

		if (role.position >= message.guild.me.roles.highest.position) {
			throw 'Cannot assign as the muted role. Role is too high in the hierarchy';
		}

		await mutedRole.setMutedRole(message.guild, role);

		return `Set ${ role.toString() } as the muted role`;
	}
};
