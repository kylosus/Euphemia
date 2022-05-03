import { Permissions }                                from 'discord.js';
import { ArgConsts, AutoEmbed }                       from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:      'pruneroles',
			aliases:         ['pruneroles', 'purgeroles'],
			description:     {
				content:  'Removes all members in a role',
				usage:    '<role>',
				examples: ['edit https://discord.com/channels/292277485310312448/292277485310312448/850097454262386738 {JSON}']
			},
			userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
			args:            [
				{
					id:      'roles',
					type:    ArgConsts.TYPE.ROLES,
					message: 'Please provide role ids',
				},
				{
					id:       'reason',
					type:     ArgConsts.TYPE.REASON,
					optional: true,
					default:  () => null
				},
			],
			guildOnly:       true,
			ownerOnly:       true,
		});
	}

	async run(message, { reason, roles }) {
		const result = new ModerationCommandResult(reason);

		result._ = [];

		for (const role of roles) {
			const members = await Promise.all(role.members.map(async m => {
				await m.roles.remove(roles);
				return m;
			}));

			result.addPassed(role);
			result.aux = members.length;

			result._.push({ role: role.id, members });
		}

		return result;
	}

	async ship(message, { _ }) {
		const embed = new AutoEmbed().setColor('GREEN').setTitle('Pruned:');

		const content = _.map(({ role, members }) => `${members.length} from ${role}`);
		embed.setDescription(content.join('\n'));

		return message.channel.send({ embeds: [embed] });
	}
}
