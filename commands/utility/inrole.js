import { MessageEmbed }                      from 'discord.js';
import { ArgConsts, ArgumentType, ECommand } from '../../lib/index.js';
import { CircularList, PaginatedMessage }    from '../../modules/index.js';
import { chunk }                             from 'lodash-es';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['inrole'],
			description: {
				content:  'Shows members in a given role',
				usage:    '[user]',
				examples: ['inrole 294846212895670273', 'inrole Something', 'avatar 275331662865367040']
			},
			args:        [
				{
					id:      'role',
					type:    new ArgumentType(
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
					message: 'Please provide a role',
				},
			],
			guildOnly:   true,
			ownerOnly:   false,
			fetchMembers: true
		});
	}

	async run(message, { role }) {
		return role;
	}

	async ship(message, result) {
		return PaginatedMessage.register(message, s => {
			return new MessageEmbed()
				.setColor(result.hexColor)
				.setTitle(`List of members in ${result.name} (${result.members.size})`)
				// .setDescription(s.map(ss => `${ss}, \`${ss.user.tag}\``).join('\n'));
				.setDescription(s.map(s => s.user.tag));
		}, new CircularList(_.chunk(result.members.array(), 20)));
	}
}
