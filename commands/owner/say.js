const { MessageEmbed, Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['say'],
			description: {
				content: 'Says something. Supports embeds',
				usage: '<text>',
				examples: ['say something', 'say {JSON}']
			},
			userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
			args: [
				{
					id: 'text',
					type: ArgConsts.TEXT,
					message: 'Please provide text'
				}
			],
			guildOnly: false,
			nsfw: false,
			ownerOnly: true,
		});
	}

	async run(message, args) {
		return args.text;
	}

	async ship(message, result) {
		try {
			const json = JSON.parse(result);
			return message.channel.send(json.content, new MessageEmbed(json));
		} catch (err) {
			return message.channel.send(result);
		}
	}
};
