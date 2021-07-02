const {MessageEmbed, Permissions} = require('discord.js');

const {ArgConsts, ArgumentType, ECommand} = require('../../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['actions'],
			description: {
				content: 'Lists moderation actions1 in the server',
				usage: '[channel or current channel] <text>',
				examples: ['actions', 'actions of=@moderator', 'actions of=@moderator to=@user']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
			args: [
				{
					id: 'of',
					type: new ArgumentType(
						`of=${ArgConsts.idRegex}`,
						ArgConsts.idExtractFlatten
					),
					optional: true,
					default: () => '*'
				},
				{
					id: 'to',
					type: new ArgumentType(
						`to=${ArgConsts.idRegex}`,
						ArgConsts.idExtractFlatten
					),
					optional: true,
					default: () => '*'
				},
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
		});
	}

	async run(message, args) {
		console.log(args);
		return 'a';
	}

	// async ship(message, [channel, text]) {
	// 	try {
	// 		const json = JSON.parse(text);
	// 		return channel.send(json.content, new MessageEmbed(json));
	// 	} catch (err) {
	// 		return channel.send(text);
	// 	}
	// }
};
