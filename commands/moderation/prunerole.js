import { MessageEmbed, Permissions }                  from 'discord.js';
import { ArgConsts, ArgumentType }                    from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';

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
			userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
			args:            [
				{
					id:       'role',
					type:     new ArgumentType(
						/.*/,
						ArgConsts.flatten,
						({ guild }, roleRes) => {
							return guild.roles.cache.get(roleRes) ||
								guild.roles.cache.find(r => r.name.toLowerCase() === roleRes.toLowerCase()) ||
								guild.roles.cache.find(r => r.name.toLowerCase().startsWith(roleRes.toLowerCase())) ||
								(() => {
									throw 'Role not found';
								})();
						}
					),
					message:  'Please provide a role',
				},
				{
					id:       'reason',
					type:     ArgConsts.REASON,
					optional: true,
					default:  () => null
				},
			],
			guildOnly:       true,
			ownerOnly:       true,
		});
	}

	async run(message, { reason, role }) {
		const result = new ModerationCommandResult(reason);

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
		return message.channel.send(new MessageEmbed()
			.setColor('GREEN')
			.setDescription(`Pruned ${members.length} members in ${role}:`)
		);
	}
}
