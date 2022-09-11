import { time, TimestampStyles, userMention, codeBlock, EmbedBuilder, PermissionsBitField } from 'discord.js';
import {
	ArgConsts, ECommand
}                                                                                           from '../../../lib/index.js';
import { getAction }                                                                        from '../db.js';

const COLOR = '#2CDDD7';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['action'],
			description: {
				content:  'Shows details of a specified action',
				usage:    '<action number>',
				examples: ['action 1']
			},
			// For Valk
			userPermissions: [PermissionsBitField.Flags.ManageRoles],
			args:            [
				{
					id:      'number',
					type:    ArgConsts.TYPE.NUMBER,
					message: 'Please specify an action number'
				}
			],
			guildOnly:       true,
			nsfw:            false,
			ownerOnly:       false,
		});
	}

	async run(message, { number }) {
		const result = await getAction({ guild: message.guild, id: number });

		if (!result) {
			throw 'Action number not found';
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

		if (result.action === 'MUTE') {
			embed.addFields({
				name:  'Muted for',
				value: (t => {
					if (!t) {
						return 'Forever';
					}

					return time(t, TimestampStyles.RelativeTime);
				})(result.aux)
			});
		}

		embed.setTimestamp(result.timestamp);

		return message.channel.send({ embeds: [embed] });
	}
}
