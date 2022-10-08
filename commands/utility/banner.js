import { EmbedBuilder }        from 'discord.js';
import { ArgConsts, ECommand } from '../../lib/index.js';
import { IMAGE_OPTIONS }       from './util.js';
import { EmbedError }          from '../../lib/Error/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['banner'],
			description: {
				content:  'Shows banner of a given user',
				usage:    '[user]',
				examples: ['banner', 'banner @Person', 'banner 275331662865367040']
			},
			args:        [
				{
					id:          'user',
					type:        ArgConsts.TYPE.USER,
					optional:    true,
					defaultFunc: m => m.author
				}
			],
			guildOnly:   false,
			ownerOnly:   false,
			slash:       true
		});
	}

	async run(message, { user }) {
		await user.fetch(true);

		const banner = user.bannerURL(IMAGE_OPTIONS);

		if (!banner) {
			throw new EmbedError(`${user.toString()} has no banner`);
		}

		const member = await message.guild.members.fetch({ user }).catch(() => {
		});
		const color  = member?.displayColor;

		return {
			user,
			color,
			banner
		};
	}

	async ship(message, { user, color, banner }) {
		return message.reply({
			embeds: [new EmbedBuilder()
				.setColor(color)
				.setDescription(`${user.toString()}'s banner`)
				.setImage(banner)]
		});
	}
}
