import { codeBlock, EmbedBuilder } from 'discord.js';
import * as EmbedLimits            from './EmbedLimits.js';
import { truncate }                from 'lodash-es';

// code block
// '''\n<stuff>\n'''
const WRAP_LENGTH = 8;

export const Limits = {
	WRAP_LENGTH,	// code block
	DESCRIPTION_WRAPPED: EmbedLimits.DESCRIPTION - WRAP_LENGTH,
	FIELD_VALUE_WRAPPED: EmbedLimits.FIELD_VALUE - WRAP_LENGTH,
}

export default class AutoEmbed extends EmbedBuilder {
	constructor(data) {
		super();
	}

	addFields(...fields) {
		const truncatedFields = fields.map(f => ({
			...f,
			name:  truncate(f.name, { length: EmbedLimits.FIELD_TITLE }),
			value: truncate(f.value, { length: EmbedLimits.FIELD_VALUE }),
		}));

		super.addFields(...truncatedFields);

		return this;
	}

	addFieldsWrap(...fields) {
		const truncatedFields = fields.map(f => ({
			...f,
			name:  truncate(f.name, { length: EmbedLimits.FIELD_TITLE }),
			value: codeBlock(truncate(f.value, { length: Limits.FIELD_VALUE_WRAPPED }))
		}));

		super.addFields(...truncatedFields);

		return this;
	}

	// setAuthor(name, iconURL, url) {
	// 	return super.setAuthor(name, iconURL, url);
	// }

	setDescription(description) {
		super.setDescription(
			truncate(description, { length: EmbedLimits.DESCRIPTION })
		);

		return this;
	}

	setDescriptionWrap(description) {
		super.setDescription(
			codeBlock(truncate(description, { length: Limits.DESCRIPTION_WRAPPED }))
		);

		return this;
	}

	setTitle(title) {
		super.setTitle(
			truncate(title, { length: EmbedLimits.TITLE })
		);

		return this;
	}
}
