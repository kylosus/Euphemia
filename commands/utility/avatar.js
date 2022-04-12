import { MessageEmbed }        from 'discord.js';
import { ArgConsts, ECommand } from '../../lib/index.js';

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
					id:       'user',
					type:     ArgConsts.TYPE.USER,
					optional: true,
					default:  m => m.author
				}
			],
			guildOnly:   false,
			ownerOnly:   false
		});
	}

	async run(message, { user }) {
		const color = ((user) => {
			const member = message.guild.member(user);

			if (member) {
				return member.displayColor;
			}

			return null;
		})(user);

		return [user.displayAvatarURL({
			dynamic: true,
			size:    4096
		}), color];
	}

	async ship(message, result) {
		return message.channel.send(new MessageEmbed()
			.setImage(result[0])
			.setColor(result[1])
		);
	}
}
