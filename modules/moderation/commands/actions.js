const {MessageEmbed, Permissions} = require('discord.js');

const {ArgConsts, ArgumentType, ECommand} = require('../../../lib');
const {CircularListGenerator, PaginatedMessage} = require('../../paginatedmessage');

const db = require('../db');

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
						new RegExp(/from[=\s]?/.source + ArgConsts.userIdRegex.source),
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
		const perPage = 20;

		const {length} = await db.getIdMax(message.guild.id);

		if (!length) {
			throw 'No entries found';
		}

		const [next, prev] = (() => {
			let lastId = length + 1;

			return [
				async () => {
					const results = await db.getModeratorTargetPage({
						guild: message.guild.id,
						moderator: args.moderator,
						target: args.target,
						perPage,
						lastId
					});

					// Failsafe
					if (!results.length) {
						return '```[ empty ]```';
					}

					lastId = results[results.length - 1].id;

					return results;
				},
				async () => {
					const results = await db.getModeratorTargetPage({
						guild: message.guild.id,
						moderator: args.moderator,
						target: args.target,
						perPage,
						lastId
					});

					// Failsafe
					if (!results.length) {
						return '```[ empty ]```';
					}

					lastId = results[results.length - 1].id;

					return results;
				}
			];
		})();

		return new CircularListGenerator([], Math.ceil(length / perPage), next, prev);

		// return new CircularListGenerator(
		// 	[],
		// 	10,
		// 	(() => {
		// 		let lastId = Number.MAX_SAFE_INTEGER;
		// 		return async () => {
		// 			const results = await db.getModeratorTargetPage({
		// 				guild: message.guild.id,
		// 				moderator: args.moderator,
		// 				target: args.target,
		// 				perPage: 10,
		// 				lastId
		// 			});
		//
		// 			lastId = results.id;
		//
		// 			return results;
		// 		};
		// 	})(),
		// 	(() => {
		// 		let lastId = Number.MAX_SAFE_INTEGER;
		// 		return async () => {
		// 			const results = await db.getModeratorTargetPage({
		// 				guild: message.guild.id,
		// 				moderator: args.moderator,
		// 				target: args.target,
		// 				perPage: 10,
		// 				lastId
		// 			});
		//
		// 			lastId = results.id;
		//
		// 			return results;
		// 		};
		// 	})()
		// );

		/*
		const results = await db.getModeratorTargetPage({
			guild: message.guild.id,
			moderator: args.moderator,
			target: args.target,
			perPage: 5
		});

		if (!results.length) {
			throw 'No entries found';
		}
		 */
	}

	async ship(message, result) {
		const generator = s => {
			const embed = new MessageEmbed()
				.setColor('GREEN')
				.setTitle(`Latest mod actions in ${message.guild}`);

			const body = typeof s === 'string' ? s : s.map(({id, passed, action, moderator: moderatorID, target: targetID}) => {
				const prefix = passed ? '✅' : '❎';	// Fix those later;
				const moderator = `<@${moderatorID}>`;
				const target = `<@${targetID}>`;

				return `${prefix} ${id} ${action} ${moderator} -> ${target}`;
			}).join('\n');

			embed.setDescription(body);
			return embed;
		};

		return PaginatedMessage.register(message, generator, result);
	}

};
