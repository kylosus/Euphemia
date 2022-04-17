import { Formatters, MessageButton }           from 'discord.js';
import { ArgConsts, ECommand }                 from '../../../lib/index.js';
import * as EmbedLimits                        from '../../../lib/EmbedLimits.js';
import { getSubscribedUsers, subscribeUserTo } from '../db.js';
import { chunk }                               from './util.js';
import { DecisionMessage }                     from '../../decisionmessage/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['tag'],
			description: {
				content:  'Pings a tag',
				usage:    '<name>',
				examples: ['tag stuff']
			},
			args:        [
				{
					id:      'tagName',
					type:    ArgConsts.TYPE.WORD,
					message: 'Please enter a tag name'
				}
			],
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message, { tagName }) {
		const res = await getSubscribedUsers({
			guild: message.guild,
			name:  tagName,
		});

		if (!res.length) {
			throw `Tag ${Formatters.inlineCode(tagName)} not found or empty`;
		}

		return { tagName, users: res.map(r => r.user) };
	}

	async ship(message, { tagName, users }) {
		const header           = `🏓 Users subscribed to ${Formatters.inlineCode(tagName)}:\n`;
		const [first, ...rest] = chunk(users.map(Formatters.userMention), EmbedLimits.CONTENT - header.length);

		let lastMessage = await message.channel.send({
			content: `${header}${first.join('')}`
		});

		for (const c of rest) {
			lastMessage = await message.channel.send({
				content: c.join('')
			});
		}

		return DecisionMessage.register(lastMessage, [
			{
				component: new MessageButton()
					.setCustomId('join')
					.setLabel('join')
					.setStyle('SECONDARY'),
				action: async interaction => {
					try {
						await subscribeUserTo({ user: interaction.user, tagName });
					} catch (error) {
						if (error.code === 'SQLITE_CONSTRAINT') {
							throw 'You are already in this tag!';
						}

						throw error;
					}

					return `Added you to ${tagName}`;
				}
			},
			{
				component: new MessageButton()
					.setCustomId('leave')
					.setLabel('leave')
					.setStyle('SECONDARY'),
				action: interaction => {
					console.log('not implemeneted yet teehee')
				}
			}
		]);
	}
}
