import { Formatters, MessageEmbed, Permissions } from 'discord.js';
import { ArgConsts, ECommand }                   from '../../../lib/index.js';
import { getAction, updateReason }               from '../db.js';

const EMOJI_OK = '✅';
const EMOJI_NO = '❎';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['reason'],
			description:     {
				content:  'Changes reason for an action',
				usage:    '<action number>',
				examples: ['action 1']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args:            [
				{
					id:      'number',
					type:    ArgConsts.TYPE.NUMBER,
					message: 'Please specify an action number'
				},
				{
					id:      'newreason',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please enter a reason'
				}
			],
			guildOnly:       true,
			nsfw:            false,
			ownerOnly:       false,
		});
	}

	async run(message, { newreason, number }) {
		const result = await getAction(message.guild.id, number);

		if (!result) {
			throw 'Action number not found';
		}

		const reason = await (async reason => {
			if (!reason) {
				return newreason;
			}

			const notice = await this.sendNotice(
				message,
				'This action already has a reason. Are you sure you want to change it?' +
				'\n' + Formatters.codeBlock(result.reason)
			);

			await notice.react(EMOJI_OK);
			await notice.react(EMOJI_NO);

			const reactions = await notice.awaitReactions({
				filter: (r, u) => u.id === message.author.id,
				time: 3000
			});

			if (!reactions.has(EMOJI_OK)) {
				throw 'Cancelled';
			}

			return newreason;
		})(result.reason);

		await updateReason({
			guild: message.guild.id,
			id:    number,
			reason
		});

		return [result.id, reason];
	}

	async ship(message, [id, reason]) {
		return message.channel.send({
			embeds: [new MessageEmbed()
				.setColor('GREEN')
				.setTitle(`Updated Action [${id}] reason in ${message.guild}`)
				.setDescription(Formatters.codeBlock(reason))]
		});
	}
}
