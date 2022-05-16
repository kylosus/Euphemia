import { Formatters, MessageButton }              from 'discord.js';
import { ECommand }                               from '../../../lib/index.js';
import * as EmbedLimits                           from '../../../lib/EmbedLimits.js';
import { getSubscribedUsers, registerTagMention } from '../db.js';
import { chunk, TagArgType }                      from './util.js';
import { DecisionMessage }                        from '../../decisionmessage/index.js';
import { subscribe }                              from './subscribe.js';
import { unsubscribe }                            from './unsubscribe.js';

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
					type:    TagArgType,
					message: 'Please enter a valid tag name'
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

		// Best effort
		registerTagMention({
			tagID:   res[0].id,
			user:    message.author,
			channel: message.channel
		}).catch(console.error);

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
				action:    async interaction => {
					return subscribe({ user: interaction.user, tagName });
				}
			},
			{
				component: new MessageButton()
					.setCustomId('leave')
					.setLabel('leave')
					.setStyle('SECONDARY'),
				action:    async interaction => {
					return unsubscribe({ guild: message.guild, user: interaction.user, tagName });
				}
			}
		]);
	}
}
