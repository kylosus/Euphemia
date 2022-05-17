import { Formatters, MessageEmbed, Permissions }      from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';
import { getMutedRole, setNewMutedRole, muteMember }  from '../../modules/mute/index.js';
import dayjs                                          from 'dayjs';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'mute',
			aliases:           ['mute'],
			description:       {
				content:  'Mutes mentioned members for a given amount of time',
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
		const duration = args.duration ? dayjs().add(args.duration).toISOString() : null;
		const result   = new ModerationCommandResult(reason, duration);

		const role = await (async guild => {
			const role = await getMutedRole(guild);

			if (role) {
				return role;
			}

			const newRole = await setNewMutedRole(guild);
			await this.sendNotice(message, `Muted role not found, created new role ${newRole.toString()}`);
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
				await muteMember(message.guild, m, role, reason, duration);
			}
		}));

		return result;
	}

	async ship(message, result) {
		const embed = new MessageEmbed()
			.setColor(result.getColor());

		if (result.passed.length) {
			embed.addField('Muted', result.passed.map(r => Formatters.userMention(r.id)).join(' '));

			// Passed and muted for a specific amount time
			if (result.aux) {
				embed.addField(
					'Expires',
					Formatters.time(new Date(result.aux), Formatters.TimestampStyles.RelativeTime),
					true
				);
			}
		}

		if (result.failed.length) {
			embed.addField(
				'Failed',
				result.failed.map(r => `${Formatters.userMention(r.id)} - ${r.reason}`).join(' ')
			);
		}

		embed.addField('Moderator', message.member.toString(), true);
		embed.addField('Reason', result?.reason ?? '*No reason provided*');

		return message.channel.send({ embeds: [embed] });
	}
}
