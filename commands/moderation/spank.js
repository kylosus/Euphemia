const { Permissions }            = require('discord.js');
const { ArgConsts, ECommand }    = require('../../lib');
const { mutedRole, muteHandler } = require('../../modules/mute');
const moment                     = require('moment');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:           ['spank'],
			description:       {
				content:  'Spanks bad people',
				usage:    '<member1> [member2 ...]',
				examples: ['spank @Person1', 'spank @Person1 @Person2']
			},
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_GUILD],
			args:              [
				{
					id:      'member',
					type:    ArgConsts.MEMBER,
					message: 'Are you trying to spank thin air?',
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { member }) {
		if (message.member.id === member.id) {
			return 'Are you trying to spank yourself?';
		}

		const toMute = (() => {
			if (!message.member.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
				return message.member;
			}

			return member;
		})();

		const role = await mutedRole.getOrSetMutedRole(message.guild);

		await member.roles.add(role, 'Spanked');

		const duration = moment().add(1, 'minutes').toISOString();
		await muteHandler.muteMember(message.guild, toMute, role, 'Spanked', duration);

		if (message.member.id === toMute.id) {
			return 'Nice try. You got yourself spanked';
		}

		return `${member} has been spanked by ${message.member}`;
	}
};
