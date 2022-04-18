import { MessageButton, Permissions } from 'discord.js';
import { ArgConsts }                  from '../../lib/index.js';
import { ECommand }                   from '../../lib/index.js';
import { DecisionMessage }            from '../../modules/decisionmessage/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			actionName:      'reping',
			aliases:         ['reping', 'b', 'deport'],
			description:     {
				content:  '(Re-)Pings a role and gives people an option to join and leave',
				usage:    '<role> [message]',
				examples: ['reping @games', 'reping Games Join now'],
			},
			userPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			args:            [
				{
					id:      'role',
					type:    ArgConsts.TYPE.ROLE_LOOSE,
					message: 'Please mention a role to ping',
				},
				{
					id:       'text',
					type:     ArgConsts.TYPE.TEXT,
					optional: true,
					default:  () => null,
				},
			],
			guildOnly:       true,
			ownerOnly:       false,
		});
	}

	async run(message, { role, text }) {
		return {
			text: `${text ?? ''}\n\n${role.toString()}`,
			role
		};
	}

	async ship(message, { role, text }) {
		const resultMessage = await message.channel.send({
			content: text
		});

		return DecisionMessage.register(resultMessage, [
			{
				component: new MessageButton()
					.setCustomId('join')
					.setLabel('Join role')
					.setStyle('SECONDARY'),
				action:    async ({ member }) => {
					await member.fetch();

					if (member.roles.cache.has(role.id)) {
						throw `You already have the ${role.name} role`;
					}

					member.roles.add(role);

					return `Added the ${role.name} role`;
				}
			},
			{
				component: new MessageButton()
					.setCustomId('leave')
					.setLabel('Leave role')
					.setStyle('SECONDARY'),
				action:    async ({ member }) => {
					if (!member.roles.cache.has(role.id)) {
						throw `You do not have the ${role.name} role`;
					}

					member.roles.remove(role);

					return `Removed the ${role.name} role`;
				}
			}
		]);
	}
}
