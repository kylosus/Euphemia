import { MessageEmbed, Permissions }                  from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';
import { getMutedRole, setNewMutedRole, muteMember }  from '../../modules/mute/index.js';
import moment                                         from 'moment';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'mute',
			aliases:           ['mute'],
			description:       {
				content:  'Mutes mentioned members for a given amount of minutes',
				usage:    '[minutes] <member1> [member2 ...]',
				examples: ['mute @Person1', 'mute 5 @Person1 @Person2']
			},
			userPermissions:   [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_GUILD],
			args:              [
				{
					id:      'members',
					type:    ArgConsts.TYPE.MEMBERS,
					message: 'Please mention members to mute'
				},
				{
					id:       'duration',
					type:     ArgConsts.TYPE.DURATION,
					optional: true,
					default:  () => null
				},
				{
					id:       'reason',
					type:     ArgConsts.TYPE.REASON,
					optional: true,
					default:  () => null
				},
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { members, reason, ...args }) {
		const duration = args.duration ? moment().add(args.duration).toISOString() : null;
		const result   = new ModerationCommandResult(reason, duration);

		const role = await (async guild => {
			const role = await mutedRole.getMutedRole(guild);

			if (role) {
				return role;
			}

			const newRole = await mutedRole.setNewMutedRole(guild);
			await this.sendNotice(message, `Muted role not found, created new role ${ newRole.toString() }`);
			return newRole;
		})(message.guild);

		await Promise.all(members.map(async m => {
			try {
				await m.roles.add(role, reason);
			} catch (error) {
				return result.addFailed(m, error.message);
			}

			result.addPassed(m);

			if (duration) {
				await muteHandler.muteMember(message.guild, m, role, reason, duration);
			}

			// this.client.emit('guildMemberMuted', m, args.duration, message.member);
		}));

		return result;
	}

	async ship(message, result) {
		const embed = new MessageEmbed()
			.setColor(result.getColor());

		if (result.passed.length) {
			const duration = result.aux ? moment(result.aux).fromNow().replace('in', 'for') : 'Forever';
			embed.addField(`Muted ${ duration }`, result.passed.map(r => `<@${ r.id }>`).join(' '));
		}

		if (result.failed.length) {
			embed.addField('Failed', result.failed.map(r => `<@${ r.id }> - ${ r.reason }`).join(' '));
		}

		embed.addField('Moderator', message.member.toString(), true);
		embed.addField('Reason', result?.reason ?? '*No reason provided*', true);

		return message.channel.send(embed);
	}
}
