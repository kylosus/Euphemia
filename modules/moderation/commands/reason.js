const moment = require('moment');

const {MessageEmbed, Permissions} = require('discord.js');

const {ArgConsts, ArgumentType, ECommand} = require('../../../lib');
const {CircularListGenerator, PaginatedMessage} = require('../../paginatedmessage');

const db = require('../db');

const COLOR = '#2CDDD7';
const EMOJI_OK = '✅';
const EMOJI_NO = '❎';

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['reason'],
			description: {
				content: 'Changes reason for an action',
				usage: '<action number>',
				examples: ['action 1']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args: [
				{
					id: 'number',
					type: ArgConsts.NUMBER,
					message: 'Please specify an action number'
				},
				{
					id: 'newreason',
					type: ArgConsts.TEXT,
					message: 'Please enter a reason'
				}
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
		});
	}

	async run(message, {newreason, number}) {
		const result = await db.getAction(message.guild.id, number);

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
				'\n' + '```' + result.reason + '```'
			);

			await notice.react(EMOJI_OK);
			await notice.react(EMOJI_NO);

			const reactions = await notice.awaitReactions(
				(r, u) => u.id === message.author.id,
				{time: 3000}
			);

			if (!reactions.has(EMOJI_OK)) {
				throw 'Cancelled';
			}

			return newreason;
		})(result.reason);

		await db.updateReason({
			guild: message.guild.id,
			id: number,
			reason
		});

		return [result.id, reason];
	}

	async ship(message, [id, reason]) {
		return message.channel.send(new MessageEmbed()
			.setColor('GREEN')
			.setTitle(`Updated Action [${id}] reason in ${message.guild}`)
			.setDescription('```' + reason + '```')
		);
	}
};
