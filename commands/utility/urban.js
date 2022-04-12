import { MessageEmbed }                     from 'discord.js';
import { ArgConsts, ECommand, EmbedLimits } from '../../lib/index.js';
import { CircularList, PaginatedMessage }   from '../../modules/index.js';
import * as ud                              from 'urban-dictionary';
import * as _                               from 'lodash';

const udIcon = 'https://cdn.discordapp.com/attachments/352865308203024395/479997284117905440/ud.png';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['urban', 'ud'],
			description: {
				content:  'Looks up Urban Dictionary definitions',
				usage:    '[prompt]',
				examples: ['ud malding']
			},
			args:        [
				{
					id:      'text',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please provide text to look up.'
				}
			],
			guildOnly:   false,
			ownerOnly:   false
		});
	}

	async run(message, { text }) {
		try {
			return await ud.define(text);
		} catch (err) {
			throw `Could not find any definitions for ${text}`;
		}
	}

	async ship(message, result) {
		return PaginatedMessage.register(message, s => {
			return new MessageEmbed()
				.setColor('GREEN')
				.setAuthor(s.word, udIcon)
				.setDescription(_.truncate(s.definition, { length: EmbedLimits.DESCRIPTION }));
		}, new CircularList(result));
	}
}
