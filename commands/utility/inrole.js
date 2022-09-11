import { EmbedBuilder }                   from 'discord.js';
import { ArgConsts, ECommand }            from '../../lib/index.js';
import { CircularList, PaginatedMessage } from '../../modules/index.js';
import { chunk }                          from 'lodash-es';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:      ['inrole'],
			description:  {
				content:  'Shows members in a given role',
				usage:    '[user]',
				examples: ['inrole 294846212895670273', 'inrole Something', 'avatar 275331662865367040']
			},
			args:         [
				{
					id:      'role',
					type:    ArgConsts.TYPE.ROLE_LOOSE,
					message: 'Please provide a role',
				},
			],
			guildOnly:    true,
			ownerOnly:    false,
			fetchMembers: true
		});
	}

	async run(message, { role }) {
		return role;
	}

	async ship(message, result) {
		return PaginatedMessage.register(message, s => {
			return new EmbedBuilder()
				.setColor(result.color)
				.setTitle(`List of members in ${result.name} (${result.members.size})`)
				.setThumbnail(result.iconURL())
				// .setDescription(s.map(ss => `${ss}, \`${ss.user.tag}\``).join('\n'));
				.setDescription(s.map(s => s.user.tag).join('\n'));
		}, new CircularList(chunk(result.members.toJSON(), 20)));
	}
}
