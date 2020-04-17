const { Command }		= require('discord.js-commando');
const { RichEmbed }		= require('discord.js');

const rp				= require('request-promise');
const { to }			= require('await-to-js');

const NEKOS_MOE_BASE	= 'https://nekos.moe/image/';
const NEKOS_MOE_ENDP	= 'https://nekos.moe/api/v1/random/image?count=1';


module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'catgirl',
			group: 'fun',
			memberName: 'catgirl',
			description: 'Returns a random catgirl.',
			aliases: ['neko'],
			nsfw: true
		});
	}


	async run(message) {
		const [err, res] = await to(rp({
			uri: NEKOS_MOE_ENDP,
			json: true
		}));

		if (err || !res.images) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('An error occurred. Please try again later')
			);
		}

		return message.channel.send(new RichEmbed()
			.setColor(global.BOT_DEFAULT_COLOR)
			.setImage(`${NEKOS_MOE_BASE}${err.images[0].id}`)
		);
	}
};