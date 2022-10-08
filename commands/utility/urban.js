import { EmbedBuilder }                     from 'discord.js';
import { ArgConsts, ECommand, EmbedLimits } from '../../lib/index.js';
import { CircularList, PaginatedMessage }   from '../../modules/index.js';
import { truncate }                         from 'lodash-es';
import { promisify }                        from 'util';
import ud                                   from 'urban-dictionary';
import { EmbedError }                       from '../../lib/Error/index.js';

const define = promisify(ud.define);

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
			return await define(text);
		} catch (err) {
			throw new EmbedError(`Could not find any definitions for ${text}`);
		}
	}

	async ship(message, result) {
		return PaginatedMessage.register(message, s => {
			return new EmbedBuilder()
				.setColor(this.client.config.COLOR_OK)
				.setAuthor({
					name:    s.word,
					iconURL: udIcon
				})
				.setDescription(truncate(s.definition, { length: EmbedLimits.DESCRIPTION }));
		}, new CircularList(result));
	}
}
