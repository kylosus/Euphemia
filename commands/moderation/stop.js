import { EmbedBuilder, PermissionsBitField }          from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'stop',
			aliases:           ['stop'],
			description:       {
				content:  'Denies Send Message permission for @everyone in specified channels.',
				usage:    '[#channel]',
				examples: ['stop', 'stop #channel'],
			},
			userPermissions:   [PermissionsBitField.Flags.ManageRoles],
			clientPermissions: [PermissionsBitField.Flags.ManageRoles],
			args:              [
				{
					id:          'channels',
					type:        ArgConsts.TYPE.CHANNELS,
					description: 'The channel to stop',
					optional:    true,
					defaultFunc: m => [m.channel]
				},
				{
					id:          'toggle',
					type:        ArgConsts.TYPE.TEXT,
					optional:    true,
					defaultFunc: () => 'on'
				},
				{
					id:          'reason',
					type:        ArgConsts.TYPE.REASON,
					optional:    true,
					defaultFunc: () => null
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
			slash:             true
		});
	}

	async run(message, { channels, toggle: _toggle, reason }) {
		// toggle is isAllowed
		const toggle = _toggle !== 'on';
		const result = new ModerationCommandResult(reason, toggle);

		await Promise.all(channels.map(async c => {
			try {
				await c.permissionOverwrites.edit(message.guild.id, { SendMessages: toggle });

				if (!toggle) {
					const highestRole = message.member.roles.highest;

					// User has 1 role and it's @everyone
					if (highestRole.id === message.guild.id) {
						return;
					}

					await c.permissionOverwrites.edit(highestRole, { SendMessages: true });
				}
			} catch (err) {
				return result.addFailed(c, err.message || 'Unknown error');
			}

			result.addPassed(c);
		}));

		return result;
	}

	async ship(message, result) {
		const embed = new EmbedBuilder()
			.setColor(result.getColor());

		if (result.passed.length) {
			embed.addFields({
				name:  `${result.aux ? 'Allowed' : 'Denied'} message sending permissions in`,
				value: result.passed.map(r => r.toString()).join(' ')
			});

			// If not allowed
			if (!result.aux) {
				embed.setFooter({ text: 'Type stop off to revert back' });
			}
		}

		if (result.failed.length) {
			embed.addFields({
				name:  'Failed',
				value: result.failed.map(r => `${r.toString()} - ${r.reason}`).join(' ')
			});
		}

		return message.channel.send({ embeds: [embed] });
	}
}
