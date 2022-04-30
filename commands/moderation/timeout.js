import { Formatters, MessageEmbed, Permissions }      from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';
import dayjs                                          from 'dayjs';

const WEEK = dayjs.duration({ weeks: 1 }).asMilliseconds();

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'timeout',
			aliases:           ['timeout', 'to'],
			description:       {
				content:  'Times out mentioned members for a given amount of time',
				usage:    '[minutes] <member1> [member2 ...]',
				examples: ['mute @Person1', 'mute 5 @Person1 @Person2']
			},
			userPermissions:   [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			args:              [
				{
					id:      'members',
					type:    ArgConsts.TYPE.MEMBERS,
					message: 'Please mention members to timeout'
				},
				{
					id:       'duration',
					type:     ArgConsts.TYPE.DURATION,
					optional: true,
					default:  () => dayjs.duration({ minutes: 5 })
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
		const duration = args.duration.asMilliseconds();

		if (duration > WEEK) {
			throw `Maximum timeout duration is ${Formatters.inlineCode('1 week')}`;
		}

		const result = new ModerationCommandResult(reason, dayjs().add(args.duration).toISOString());

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
		const embed = new MessageEmbed()
			.setColor(result.getColor());

		if (result.passed.length) {
			embed.addField('Muted', result.passed.map(r => `<@${r.id}>`).join(' '));
			embed.addField('Expires', Formatters.time(new Date(result.aux), Formatters.TimestampStyles.RelativeTime), true);
		}

		if (result.failed.length) {
			embed.addField('Failed', result.failed.map(r => `<@${r.id}> - ${r.reason}`).join(' '));
		}

		embed.addField('Moderator', message.member.toString(), true);
		embed.addField('Reason', result?.reason ?? '*No reason provided*');

		return message.channel.send({ embeds: [embed] });
	}
}
