import { inlineCode, ButtonBuilder, EmbedBuilder, ButtonStyle, MessagePayload } from 'discord.js';
import { ECommand }                                                             from '../../../lib/index.js';
import { DecisionMessage }                                                      from '../../decisionmessage/index.js';
import { createTag }                                                            from '../db.js';
import { subscribe }                                                            from './subscribe.js';
import { unsubscribe }                                                          from './unsubscribe.js';
import { TagArgType }                                                           from './util.js';
import { EmbedError }                                                           from '../../../lib/Error/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['tagadd', 'addtag'],
			description: {
				content:  'Adds a new tag',
				usage:    '<name>',
				examples: ['tagadd stuff']
			},
			args:        [
				{
					id:          'tag',
					type:        TagArgType,
					description: 'Name of the new tag',
					message:     'Please enter a tag name'
				}
			],
			guildOnly:   true,
			ownerOnly:   false,
			slash:       true
		});
	}

	async run(message, { tag }) {
		try {
			await createTag({
				guild:   message.guild,
				name:    tag,
				creator: message.author
			});
		} catch (error) {
			// Not a great way of handling errors
			if (error.code === 'SQLITE_CONSTRAINT') {
				throw new EmbedError(`Tag ${inlineCode(tag)} already exists`);
			}

			throw error;
		}

		return { tagName: tag, result: `Created tag ${inlineCode(tag)}` };

	}

	async ship(message, { tagName, result }) {
		const messagePayload = MessagePayload.create(message, {
			embeds: [new EmbedBuilder()
				.setColor(this.client.config.COLOR_OK)
				.setDescription(result)]
		});

		return DecisionMessage.register(message, messagePayload, [
			{
				component: new ButtonBuilder()
					.setCustomId('join')
					.setLabel('join')
					.setStyle(ButtonStyle.Secondary),
				action:    async interaction => {
					return subscribe({ user: interaction.user, tagName });
				}
			},
			{
				component: new ButtonBuilder()
					.setCustomId('leave')
					.setLabel('leave')
					.setStyle(ButtonStyle.Secondary),
				action:    async interaction => {
					return unsubscribe({ guild: message.guild, user: interaction.user, tagName });
				}
			}
		]);
	}
}
