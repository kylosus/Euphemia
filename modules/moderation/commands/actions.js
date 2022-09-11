import { userMention, underscore, inlineCode, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ArgConsts, ArgumentType, ECommand }                                      from '../../../lib/index.js';
import {
	CircularListGenerator, PaginatedMessage
}                                                                                 from '../../paginatedmessage/index.js';
import { getIdMax, getModeratorTargetPage }                                       from '../db.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['actions'],
			description:     {
				content:  'Lists moderation actions in the server',
				usage:    '[from @moderator] [to @member]',
				examples: ['actions', 'actions from=@moderator', 'actions from @moderator to @user']
			},
			// For Valk
			userPermissions: [PermissionsBitField.Flags.ManageRoles],
			args:            [
				{
					id:       'moderator',
					type:     new ArgumentType(
						new RegExp(/from[=\s]?/.source + ArgConsts.userIdRegex.source),
						ArgConsts.idExtractFlatten
					),
					optional: true,
					default:  () => undefined
				},
				{
					id:       'target',
					type:     new ArgumentType(
						new RegExp(/to[=\s]?/.source + ArgConsts.userIdRegex.source),
						ArgConsts.idExtractFlatten
					),
					optional: true,
					default:  () => undefined
				},
			],
			guildOnly:       true,
			nsfw:            false,
			ownerOnly:       false,
		});
	}

	async run(message, args) {
		const perPage = 20;

		const { length } = await getIdMax({ guild: message.guild });

		if (!length) {
			throw 'No entries found';
		}

		const [next, prev] = (() => {
			let lastId = length + 1;

			return [
				async () => {
					const results = await getModeratorTargetPage({
						guild:     message.guild.id,
						moderator: args.moderator,
						target:    args.target,
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
					lastId += perPage * 2;

					const results = await getModeratorTargetPage({
						guild:     message.guild.id,
						moderator: args.moderator,
						target:    args.target,
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
	}

	async ship(message, result) {
		const generator = s => {
			const embed = new EmbedBuilder()
				.setColor(this.client.config.COLOR_OK)
				.setTitle(`Latest mod actions in ${message.guild}`);

			const body = typeof s === 'string' ? s : s.map(({
				id,
				passed,
				action,
				moderator: moderatorID,
				target:    targetID
			}) => {
				const prefix    = passed ? '✅' : '❌';	// Fix those later;
				const moderator = userMention(moderatorID);
				const target    = userMention(targetID);

				return `${prefix} \`[${id}]\` ${action.toLowerCase()} ${moderator} -> ${target}`;
			}).join('\n');

			embed.setDescription(
				underscore(`Run ${inlineCode('action <number>')} to get details`)
				+ '\n\n' + body
			);
			return embed;
		};

		return PaginatedMessage.register(message, generator, result);
	}
}
