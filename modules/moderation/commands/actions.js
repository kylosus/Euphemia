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
					id: 'moderator',
					type: new ArgumentType(
						new RegExp(/of[=\s]?/.source + ArgConsts.userIdRegex.source),
						ArgConsts.idExtractFlatten
					),
					optional: true,
					default: () => undefined
				},
				{
					id: 'target',
					type: new ArgumentType(
						new RegExp(/to[=\s]?/.source + ArgConsts.userIdRegex.source),
						ArgConsts.idExtractFlatten
					),
					optional: true,
					default: () => undefined
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
