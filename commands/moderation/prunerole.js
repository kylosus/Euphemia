import { EmbedBuilder, PermissionsBitField }          from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';
import { EmbedError }                                 from '../../lib/Error/index.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:      'prunerole',
			aliases:         ['prunerole', 'purgerole'],
			description:     {
				content:  'Removes all members in a role',
				usage:    '<role>',
				examples: ['edit https://discord.com/channels/292277485310312448/292277485310312448/850097454262386738 {JSON}']
			},
			userPermissions: [PermissionsBitField.Flags.Administrator],
			args:            [
				{
					id:          'role',
					type:        ArgConsts.TYPE.ROLE_LOOSE,
					description: 'The role to prune',
					message:     'Please provide a role',
				},
				{
					id:          'reason',
					type:        ArgConsts.TYPE.REASON,
					optional:    true,
					defaultFunc: () => null
				},
			],
			guildOnly:       true,
			ownerOnly:       true,
			slash:           true,
			defer:           true,
			fetchMembers:    true
		});
	}

	async run(message, { reason, role }) {
		const result = new ModerationCommandResult(reason);

		if (!role.editable) {
			throw new EmbedError('I cannot modify this role');
		}

		if (role.comparePositionTo(message.member.roles.highest) >= 0) {
			throw new EmbedError('You cannot modify this role');
		}

		const members = await Promise.all(role.members.map(async m => {
			await m.roles.remove(role);
			return m;
		}));

		result.addPassed(role);
		result.aux = members.length;

		result._ = { role, members };

		return result;
	}

	async ship(message, { _: { role, members } }) {
		return message.reply({
			embeds: [new EmbedBuilder()
				.setColor(this.client.config.COLOR_OK)
				.setDescription(`Pruned ${members.length} members from ${role}:`)]
		});
	}
}
