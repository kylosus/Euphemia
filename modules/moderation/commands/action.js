import { time, TimestampStyles, userMention, codeBlock, EmbedBuilder, PermissionsBitField } from 'discord.js';
import {
	ArgConsts, ECommand
}                                                                                           from '../../../lib/index.js';
import { getAction }                                                                        from '../db.js';
import {
	EmbedError
}                                                                                           from '../../../lib/Error/index.js';

const COLOR = '#2CDDD7';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['action'],
			description:     {
				content:  'Shows details of a specified action',
				usage:    '<action number>',
				examples: ['action 1']
			},
			userPermissions: [PermissionsBitField.Flags.ManageGuild],
			args:            [
				{
					id:          'number',
					type:        ArgConsts.TYPE.NUMBER,
					description: 'The action number',
					message:     'Please specify an action number'
				}
			],
			guildOnly:       true,
			nsfw:            false,
			ownerOnly:       false,
			slash:           true
		});
	}

	async run(message, { number }) {
		const result = await getAction({ guild: message.guild, id: number });

		if (!result) {
			throw new EmbedError('Action number not found');
		}

		return result;
	}

	async ship(message, result) {
		const embed = new EmbedBuilder()
			.setColor(COLOR);

		embed.setAuthor((user => {
			if (user) {
				return {
					name:    `${user.tag} (${result.moderator})}`,
					iconURL: user.displayAvatarURL()
				};
			}

			return { name: `Unknown user: ${result.moderator}` };
		})(await this.client.users.fetch(result.moderator).catch(console.error)));

		const prefix = result.passed ? '✅' : '❌';	// Fix those later
		embed.setDescription(`${prefix} Action \`[${result.id}]\` ${result.action.toLowerCase()} -> ${userMention(result.target)}`);
		embed.addFields({ name: 'Reason', value: codeBlock(result.reason ?? 'No reason provided') });

		if (!result.passed) {
			embed.addFields({ name: 'Failed', value: codeBlock(result.failedReason ?? 'Unknown reason') });
		}

		if (result.action === 'MUTE' || result.action === 'TIMEOUT') {
			embed.addFields({
				name:  'Muted:',
				value: (t => {
					if (!t) {
						return 'Forever';
					}

					return `${time(new Date(result.timestamp), TimestampStyles.LongDateTime)} - ${time(new Date(t), TimestampStyles.LongDateTime)}`;
				})(result.aux)
			});
		}

		embed.setTimestamp(new Date(result.timestamp));

		return message.reply({ embeds: [embed] });
	}
}
