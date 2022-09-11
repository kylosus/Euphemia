import { channelMention, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ArgConsts }                                         from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult }        from '../../modules/moderation/index.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'nopics',
			aliases:           ['nopics', 'disablepics'],
			description:       {
				content:  'Denies Attach Files and Embed Links permissions for @everyone in specified channels.',
				usage:    '[#channel]',
				examples: ['nopics', 'nopics #channel'],
			},
			userPermissions:   [PermissionsBitField.Flags.ManageRoles],
			clientPermissions: [PermissionsBitField.Flags.ManageRoles],
			args:              [
				{
					id:       'channels',
					type:     ArgConsts.TYPE.CHANNELS,
					optional: true,
					default:  m => [m.channel]
				},
				{
					id:       'toggle',
					type:     ArgConsts.TYPE.WORD,
					optional: true,
					default:  () => 'on'
				},
				{
					id:       'reason',
					type:     ArgConsts.TYPE.REASON,
					optional: true,
					default:  () => null
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { channels, toggle: _toggle, reason }) {
		const toggle = _toggle !== 'on';
		const result = new ModerationCommandResult(reason, toggle);

		await Promise.all(channels.map(async c => {
			try {
				await c.permissionOverwrites.edit(message.guild.id, {
					AttachFiles: toggle,
					EmbedLinks:  toggle
				});
			} catch (err) {
				return result.addFailed(c, err.message);
			}

			result.addPassed(c);
		}));

		return result;
	}

	async ship(message, result) {
		const wrap = channelMention;

		const embed = new EmbedBuilder()
			.setColor(result.getColor());

		if (result.passed.length) {
			embed.addFields({
				name:  `${result.aux ? 'Allowed' : 'Denied'} message sending permission in`,
				value: result.passed.map(r => wrap(r.id)).join(' ')
			});
		}

		// If not allowed
		if (!result.aux) {
			embed.setFooter({ text: 'Type nopics off to revert back' });
		}

		if (result.failed.length) {
			embed.addFields({
				name:  'Failed',
				value: result.failed
					.map(({ id, reason = 'Unknown reason' }) => `${wrap(id)} - ${reason}`)
					.join(' ')
			});
		}

		return message.channel.send({ embeds: [embed] });
	}
}
