import { inlineCode, userMention, EmbedBuilder } from 'discord.js';
import { ECommand }                              from '../../../lib/index.js';
import { getSubscribedUsers }                    from '../db.js';
import { CircularList, PaginatedMessage }        from '../../paginatedmessage/index.js';
import { chunk }                                 from 'lodash-es';
import { COLOR, PER_PAGE }                       from './consts.js';
import { TagArgType }                            from './util.js';
import { EmbedError }                            from '../../../lib/Error/index.js';


export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['intag'],
			description: {
				content:  'Shows all users in the tag without pinging',
				usage:    '<name>',
				examples: ['intag stuff']
			},
			args:        [
				{
					id:          'tag',
					type:        TagArgType,
					description: 'The name of the tag to show',
					message:     'Please enter a tag name'
				}
			],
			guildOnly:   true,
			ownerOnly:   false,
			slash:       true
		});
	}

	async run(message, { tag }) {
		const res = await getSubscribedUsers({
			guild: message.guild,
			name:  tag,
		});

		if (!res.length) {
			throw new EmbedError(`Tag ${inlineCode()} not found or empty`);
		}

		return { tagName: tag, users: res.map(r => r.user) };
	}

	async ship(message, { tagName, users }) {
		return PaginatedMessage.register(message, s => {
			return new EmbedBuilder()
				.setTitle(`User subscribed to ${tagName}`)
				.setColor(COLOR)
				.setDescription(s.map(userMention).join('\n'));
		}, new CircularList(chunk(users, PER_PAGE)));
	}
}
