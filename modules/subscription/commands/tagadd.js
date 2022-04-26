import { Formatters, MessageButton, MessageEmbed } from 'discord.js';
import { ECommand }                                from '../../../lib/index.js';
import { DecisionMessage }                         from '../../decisionmessage/index.js';
import { createTag }                               from '../db.js';
import { subscribe }                               from './subscribe.js';
import { unsubscribe }                             from './unsubscribe.js';
import { TagArgType }                              from './util.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['tagadd'],
			description: {
				content:  'Adds a new tag',
				usage:    '<name>',
				examples: ['tagadd stuff']
			},
			args:        [
				{
					id:      'tagName',
					type:    TagArgType,
					message: 'Please enter a tag name'
				}
			],
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message, { tagName }) {
		try {
			await createTag({
				guild:   message.guild,
				name:    tagName,
				creator: message.author
			});
		} catch (error) {
			// Not a great way of handling errors
			if (error.code === 'SQLITE_CONSTRAINT') {
				throw `Tag ${Formatters.inlineCode(tagName)} already exists`;
			}

			throw error;
		}

		return { tagName, result: `Created tag ${Formatters.inlineCode(tagName)}` };

	}

	async ship(message, { tagName, result }) {
		const resultMessage = await message.channel.send({
			embeds: [new MessageEmbed()
				.setColor('GREEN')
				.setDescription(result)]
		});

		return DecisionMessage.register(resultMessage, [
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
