import { codeBlock, EmbedBuilder } from 'discord.js';
import * as EmbedLimits            from './EmbedLimits.js';
import { truncate }                from 'lodash-es';

export default class AutoEmbed extends EmbedBuilder {
	constructor(data) {
		super(data);
	}

	addFields(...fields) {
		const truncatedFields = fields.map(f => ({
			name:  truncate(f.name, { length: EmbedLimits.FIELD_TITLE }),
			value: truncate(f.value, { length: EmbedLimits.FIELD_VALUE }),
			...f	// Not sure about this one
		}));

		return super.addFields(...truncatedFields);
	}

	addFieldsWrap(...fields) {
		const truncatedFields = fields.map(f => ({
			name:  truncate(f.name, { length: EmbedLimits.FIELD_TITLE }),
			value: truncate(f.value, { length: EmbedLimits.FIELD_VALUE }),
			...f	// Not sure about this one
		}));

		return super.addFields(...truncatedFields);
	}

	addFieldWrap(...fields) {
		const truncatedFields = fields.map(f => ({
			name:  truncate(f.name, { length: EmbedLimits.FIELD_TITLE }),
			value: codeBlock(truncate(f.value, { length: EmbedLimits.FIELD_VALUE - 6 })),
			...f	// Not sure about this one
		}));

		return super.addFields(...truncatedFields);
	}

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
			codeBlock(truncate(description, { length: EmbedLimits.DESCRIPTION - 6 }))
		);
	}

	setTitle(title) {
		return super.setTitle(
			truncate(title, { length: EmbedLimits.TITLE })
		);
	}
}
