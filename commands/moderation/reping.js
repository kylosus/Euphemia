import { inlineCode, ButtonBuilder, ButtonStyle, PermissionsBitField, MessagePayload } from 'discord.js';
import { ArgConsts }                                                                   from '../../lib/index.js';
import { ECommand }                                                                    from '../../lib/index.js';
import {
	DecisionMessage
}                                                                                      from '../../modules/decisionmessage/index.js';
import { EmbedError }                                                                  from '../../lib/Error/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			actionName:      'reping',
			aliases:         ['reping'],
			description:     {
				content:  '(Re-)Pings a role and gives people an option to join and leave',
				usage:    '<role> [message]',
				examples: ['reping @games', 'reping Games Join now'],
			},
			userPermissions: [PermissionsBitField.Flags.ManageRoles],
			args:            [
				{
					id:          'role',
					type:        ArgConsts.TYPE.ROLE_LOOSE,
					description: 'The role to ping',
					message:     'Please mention a role to ping',
				},
				{
					id:          'text',
					type:        ArgConsts.TYPE.TEXT,
					description: 'The text to send',
					optional:    true,
					defaultFunc: () => '',
				},
			],
			guildOnly:       true,
			ownerOnly:       false,
			slash:           true,
			ephemeral:       true
		});
	}

	async run(message, { role, text }) {
		if (!role.editable) {
			throw new EmbedError('I do not have enough permissions to assign this role');
		}

		const messagePayload = MessagePayload.create(message, {
			content: `${text}\n\n${role.toString()}`
		});

		await DecisionMessage.register(message, messagePayload, [
			{
				component: new ButtonBuilder()
					.setCustomId('join')
					.setLabel('Join role')
					.setStyle(ButtonStyle.Secondary),
				action:    async ({ member }) => {
					if (member.roles.cache.has(role.id)) {
						throw `You already have the ${inlineCode(role.name)} role`;
					}

					await member.roles.add(role);

					return `Added the ${inlineCode(role.name)} role`;
				}
			},
			{
				component: new ButtonBuilder()
					.setCustomId('leave')
					.setLabel('Leave role')
					.setStyle(ButtonStyle.Secondary),
				action:    async ({ member }) => {
					if (!member.roles.cache.has(role.id)) {
						throw `You do not have the ${inlineCode(role.name)} role`;
					}

					await member.roles.remove(role);

					return `Removed the ${inlineCode(role.name)} role`;
				}
			}
		]);
	}
}
