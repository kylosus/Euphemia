const { MessageEmbed, Permissions }                  = require('discord.js');
const { ArgConsts }                                  = require('../../lib');
const { ModerationCommand, ModerationCommandResult } = require('../../modules/moderation');
const { mutedRole }                                  = require('../../modules/mute');

module.exports = class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'unmute',
			aliases:           ['unmute'],
			description:       {
				content:  'Unmutes mentioned users',
				usage:    '<member1> [member2 ...]',
				examples: ['unmute @Person1', 'unmute @Person1 @Person2']
			},
			userPermissions:   [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_GUILD],
			args:              [
				{
					id:      'members',
					type:    ArgConsts.MEMBERS,
					message: 'Please mention members to unmute'
				},
				{
					id:       'reason',
					type:     ArgConsts.REASON,
					optional: true,
					default:  () => null
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { members, reason }) {
		const result = new ModerationCommandResult(reason);

		const role = await mutedRole.getMutedRole(message.guild);

		if (!role) {
			throw 'Muted role not found';
		}

		await Promise.all(members.map(async m => {
			// Look up other roles that remove message send permissions
			if (!role.members.has(m.id)) {
				return result.addFailed(m, 'Not muted');
			}

			try {
				await m.roles.remove(role, reason);
			} catch (error) {
				return result.addFailed(m, error.message);
			}

			result.addPassed(m);

			// this.client.emit('guildMemberUnmuted', m, message.member);
		}));

		return result;
	}

	async ship(message, result) {
		const color = result.getColor();

		const embed = new MessageEmbed()
		.setColor(color);

		if (result.p.length) {
			embed.addField('Unmuted', result.p.map(p => p.toString()).join(' '));
		}

		if (result.f.length) {
			embed.addField('Failed', result.f.map(f => `${ f.member.toString() } - ${ f.reason }`).join('\n'));
		}

		return message.channel.send(embed);
	}
};
