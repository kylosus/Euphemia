const {MessageEmbed, Permissions} = require('discord.js');

const {ArgConsts, ECommand} = require('../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['getembed'],
			description: {
				content: 'Says something. Supports embeds',
				usage: '[channel or current channel] <text>',
				examples: ['say something', 'say #general {JSON}']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
			args: [
				{
					id: 'channel',
					type: ArgConsts.CHANNEL,
					optional: true,
					default: m => m.channel
				},
				{
					id: 'id',
					type: ArgConsts.TEXT,
					message: 'Please provide a message id.'
				}
			],
			guildOnly: false,
			nsfw: false,
			ownerOnly: true,
		});
	}

	async run(message, {channel, id}) {
		const m = await channel.messages.fetch(id);

		if (!m.embeds) {
			throw 'Message has no embeds';
		}

		return m.embeds[0].toJSON();
	}

	async ship(message, result) {
		return message.channel.send(new MessageEmbed()
			.setColor('GREEN')
			.setDescription('```' + JSON.stringify(result, null, 4) + '```')
		);
	}
};
