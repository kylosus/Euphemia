import { Formatters, MessageEmbed } from 'discord.js';
import * as EmbedLimits             from './EmbedLimits.js';
import { truncate }                 from 'lodash-es';

export default class AutoEmbed extends MessageEmbed {
	constructor(data) {
		super(data);
	}

	addField(name, value, inline) {
		return super.addField(
			truncate(name, { length: EmbedLimits.FIELD_TITLE }),
			truncate(value, { length: EmbedLimits.FIELD_VALUE }),
			inline
		);
	}

	addFieldWrap(name, value, inline) {
		return super.addField(
			name,
			Formatters.codeBlock(truncate(value, { length: EmbedLimits.FIELD_VALUE - 6 })),
			inline
		);
	}

	// addFields(...fields) {
	// 	return super.addFields(...fields);
	// }

	// setAuthor(name, iconURL, url) {
	// 	return super.setAuthor(name, iconURL, url);
	// }

	setDescription(description) {
		return super.setDescription(
			truncate(description, { length: EmbedLimits.DESCRIPTION })
		);
	}

	setDescriptionWrap(description) {
		return super.setDescription(
			Formatters.codeBlock(truncate(description, { length: EmbedLimits.DESCRIPTION - 6 }))
		);
	}

	setTitle(title) {
		return super.setTitle(
			_.truncate(title, { length: EmbedLimits.TITLE })
		);
	}
}
