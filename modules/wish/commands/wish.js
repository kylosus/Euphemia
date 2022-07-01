import { ECommand }                from '../../../lib/index.js';
import { ArgConsts }                from '../../../lib/index.js';
import { Formatters, MessageEmbed } from 'discord.js';
import { addWish, getWishMessage }  from '../db.js';

const GUILD_ID   = '292277485310312448';
const CHANNEL_ID = '420272882900533248';

let guild   = null;
let channel = null;

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['wish'],
			description: {
				content:  'Makes a wish',
				usage:    'wish1 | wish2',
				examples: ['wish For eternal love | For joker-senpai to notice me'],
			},
			args:        [
				{
					id:      'wishes',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please add your wishes'
				},
			],
			guildOnly:   true,
			ownerOnly:   false,
		});

		client.on('ready', () => {
			guild   = client.guilds.cache.get(GUILD_ID);
			channel = guild.channels.cache.get(CHANNEL_ID);
		});
	}

	async run(message, { wishes }) {
		if (message.guild.id !== GUILD_ID) {
			return;
		}

		message.NOLOG = true;
		message.delete().catch(() => {
		});

		const [wish1, wish2] = wishes.split('|').map(w => w.trim());

		if (!wish1.length || !wish2.length) {
			throw `Your wishes are empty. See ${Formatters.inlineCode(';help wish')}`;
		}

		// Delete old wish message
		const oldWish = await getWishMessage({ user: message.author });

		if (oldWish) {
			await (await channel.messages.fetch(oldWish.message)).delete();
		}

		try {
			const wishMessage = await channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('GREEN')
						.setTitle('🌸 Someone has made a wish')
						.addField('Wish 1', wish1)
						.addField('Wish 2', wish2)
				]
			});

			await addWish({
				user:    message.author,
				wish:    wishes,
				message: wishMessage
			});
		} catch (err) {
			throw 'Failed recording your wish, please try again later.';
		}

		return 'Added your wish. Thanks!';
	}
}

