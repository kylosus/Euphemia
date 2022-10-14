import { EmbedBuilder, PermissionsBitField }          from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';

const CATEGORIES = [
	'372324585099624449', // General
	'372324907129765889', // Geass Universe
	'372324989304700930', // Community
	'551017136227745804', // Miscellaneous
	'443080548437458944', // Opt-in
	'372325226010116096', // Voice Channels
];

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'stopall',
			aliases:           ['stopall'],
			description:       {
				content:  'Locks down all channels',
				usage:    'on/off [reason]',
				examples: ['stop', 'stop #channel'],
			},
			userPermissions:   [PermissionsBitField.Flags.ManageRoles],
			clientPermissions: [PermissionsBitField.Flags.ManageRoles],
			args:              [
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

	async run(message, { toggle: _toggle, reason }) {
		// toggle is isAllowed
		const toggle = _toggle !== 'on';
		const result = new ModerationCommandResult(reason, toggle);

		const channels = message.guild.channels.cache
			.filter(c => c.isTextBased())
			.filter(c => CATEGORIES.includes(c.parent.id));

		await Promise.all(channels.map(async c => {
			try {
				await c.permissionOverwrites.edit(message.guild.id, {
					SendMessages:          toggle,
					SendMessagesInThreads: toggle
				});

				if (!toggle) {
					const highestRole = message.member.roles.highest;

					// User has 1 role and it's @everyone
					if (highestRole.id === message.guild.id) {
						return;
					}

					await c.permissionOverwrites.edit(highestRole, {
						SendMessages:          true,
						SendMessagesInThreads: true
					});
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
