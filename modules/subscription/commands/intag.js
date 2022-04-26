import { Formatters, MessageEmbed }       from 'discord.js';
import { ECommand }                       from '../../../lib/index.js';
import { getSubscribedUsers }             from '../db.js';
import { CircularList, PaginatedMessage } from '../../paginatedmessage/index.js';
import { chunk }                          from 'lodash-es';
import { COLOR, PER_PAGE }                from './consts.js';
import { TagArgType }                     from './util.js';


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
		return PaginatedMessage.register(message, s => {
			return new MessageEmbed()
				.setTitle(`User subscribed to ${tagName}`)
				.setColor(COLOR)
				.setDescription(s.map(Formatters.userMention).join('\n'));
		}, new CircularList(chunk(users, PER_PAGE)));
	}
}
