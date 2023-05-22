import { inlineCode, time, TimestampStyles, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ArgConsts }                                                            from '../../lib/index.js';
import {
	ModerationCommand, ModerationCommandResult
}                                                                               from '../../modules/moderation/index.js';
import dayjs                                                                    from 'dayjs';
import { EmbedError }                                                           from '../../lib/Error/index.js';

const MINUTE = dayjs.duration({ minutes: 1 }).asMilliseconds();
const WEEK   = dayjs.duration({ weeks: 1 }).asMilliseconds();

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'timeout',
			aliases:           ['mute', 'timeout', 'to'],
			description:       {
				content:  'Times out mentioned members for a given amount of time',
				usage:    '[minutes] <member1> [member2 ...]',
				examples: ['mute @Person1', 'mute 5 @Person1 @Person2']
			},
			userPermissions:   [PermissionsBitField.Flags.ModerateMembers],
			clientPermissions: [PermissionsBitField.Flags.ModerateMembers],
			args:              [
				{
					id:          'members',
					type:        ArgConsts.TYPE.MEMBERS,
					description: 'The member to timeout',
					message:     'Please mention members to timeout'
				},
				{
					id:          'duration',
					type:        ArgConsts.TYPE.DURATION,
					description: 'Duration of the timeout',
					optional:    true,
					defaultFunc: () => dayjs.duration({ minutes: 5 })
				},
				{
					id:          'reason',
					type:        ArgConsts.TYPE.REASON,
					description: 'Reason for the timeout',
					optional:    true,
					defaultFunc: () => null
				},
			],
			guildOnly:         true,
			ownerOnly:         false,
			slash:             true
		});
	}

	async run(message, { members, reason, ...args }) {
		const duration = args.duration.asMilliseconds?.() ?? args.duration * MINUTE;

		if (duration > WEEK) {
			throw new EmbedError(`Maximum timeout duration is ${inlineCode('1 week')}`);
		}

		// aux is expiration date
		const result = new ModerationCommandResult(reason, dayjs().add(args.duration).toISOString());

		// For better embeds
		// We check specially because slash commands return a number
		result.duration = args.duration.humanize?.() ?? `${args.duration} minutes`;

		await Promise.all(members.map(async m => {
			try {
				await m.timeout(duration, reason);
			} catch (error) {
				return result.addFailed(m, error.message);
			}

			result.addPassed(m);
		}));

		return result;
	}

	async ship(message, result) {
		const embed = new EmbedBuilder()
			.setColor(result.getColor());

		if (result.passed.length) {
			embed.addFields(
				{ name: 'Muted', value: result.passed.map(r => `<@${r.id}>`).join(' ') },
				{ name:     'Duration',
					value:  `${result.duration} (expires ${time(new Date(result.aux), TimestampStyles.RelativeTime)})`,
					inline: false
				}
			);
		}

		if (result.failed.length) {
			embed.addFields({ name: 'Failed', value: result.failed.map(r => `<@${r.id}> - ${r.reason}`).join(' ') });
		}

		embed.addFields(
			{ name: 'Moderator', value: message.member.toString(), inline: true },
			{ name: 'Reason', value: result?.reason ?? '*No reason provided*', inline: true }
		);

		return message.reply({ embeds: [embed] });
	}
}
