import { time, userMention, TimestampStyles, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ArgConsts }                                                             from '../../lib/index.js';
import {
	ModerationCommand, ModerationCommandResult
}                                                                                from '../../modules/moderation/index.js';
import { getMutedRole, setNewMutedRole, muteMember }                             from '../../modules/mute/index.js';
import dayjs                                                                     from 'dayjs';

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
			userPermissions:   [PermissionsBitField.Flags.ManageRoles],
			clientPermissions: [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageGuild],
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
		const embed = new EmbedBuilder()
			.setColor(result.getColor());

		if (result.passed.length) {
			embed.addFields({ name: 'Muted', value: result.passed.map(r => userMention(r.id)).join(' ') });

			// Passed and muted for a specific amount time
			if (result.aux) {
				embed.addFields({
					name:   'Expires',
					value:  time(new Date(result.aux), TimestampStyles.RelativeTime),
					inline: true
				});
			}
		}

		if (result.failed.length) {
			embed.addFields({
				name:  'Failed',
				value: result.failed.map(r => `${userMention(r.id)} - ${r.reason}`).join(' ')
			});
		}

		embed.addFields(
			{ name: 'Moderator', value: message.member.toString(), inline: true },
			{ name: 'Reason', value: result?.reason ?? '*No reason provided*' }
		);

		return message.channel.send({ embeds: [embed] });
	}
}
