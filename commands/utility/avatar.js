import { MessageEmbed }                   from 'discord.js';
import { ArgConsts, ECommand }            from '../../lib/index.js';
import { CircularList, PaginatedMessage } from '../../modules/index.js';
import { IMAGE_OPTIONS }                  from './util.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['avatar'],
			description: {
				content:  'Shows avatar of a given user',
				usage:    '[user]',
				examples: ['avatar', 'avatar @Person', 'avatar 275331662865367040']
			},
			args:        [
				{
					id:       'id',
					type:     ArgConsts.TYPE.ID,
					optional: true,
					default:  m => m.author.id
				}
			],
			guildOnly:   false,
			ownerOnly:   false
		});
	}

	async run(message, { id }) {
		const result = {
			user:    null,
			avatars: [],
			color:   null
		};

		const user  = await this.client.users.fetch(id);
		result.user = user;

		const member = await message.guild.members.fetch(user).catch(() => {});
		result.color = member?.displayColor;

		result.avatars = [
			...(member?.avatarURL() ? [member.avatarURL(IMAGE_OPTIONS)] : []),	// no
			user.displayAvatarURL(IMAGE_OPTIONS)
		];

		return result;
	}

	async ship(message, { user, avatars, color }) {
		return PaginatedMessage.register(message, s => {
			return new MessageEmbed()
				.setColor(color)
				.setDescription(`${user.toString()}'s avatar`)
				.setImage(s);
		}, new CircularList(avatars));
	}
}
