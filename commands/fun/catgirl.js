const { Command }		= require('discord.js-commando');
const { RichEmbed }		= require('discord.js');
const rp				= require('request-promise');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'catgirl',
            group: 'fun',
            memberName: 'catgirl',
            description: 'Returns a random catgirl.',
            aliases: ['neko'],
            nsfw: true,
            guildOnly: true
        });
    }
const NEKOS_MOE_BASE	= 'https://nekos.moe/image/';
const NEKOS_MOE_ENDP	= 'https://nekos.moe/api/v1/random/image?count=1';

    async run(message) {
        const embed = new RichEmbed();

	async run(message) {
		const response = (async (options) => {
			try {
				return await rp(options);
			} catch (error) {
				return null;
			}
		})({
			uri: NEKOS_MOE_ENDP,
			json: true
		});

		if (!response || !response.images) {		// Might break idk check https://docs.nekos.moe/images.html#get-random-images
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('An error occurred. Please try again later')
			);
		}

		return message.channel.send(new RichEmbed()
			.setColor(global.BOT_DEFAULT_COLOR)
			.setImage(`${NEKOS_MOE_BASE}${response.images[0].id}`)
		);
	}
};
