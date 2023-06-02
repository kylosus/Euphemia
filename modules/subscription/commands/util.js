import { ApplicationCommandOptionType, inlineCode } from 'discord.js';
import ArgumentType
																				from '../../../lib/Argument/ArgumentType.js';
import {
	flatten
}                                                                               from '../../../lib/Argument/ArgumentTypeConstants.js';
import { MAX_TAG_LENGTH }                                            from '../db.js';
import { EmbedError }                                                           from '../../../lib/Error/index.js';
import {
	AUTOCOMPLETE_MAX
}                                                                               from '../../../lib/Argument/Argument.js';

export const TagArgType = new ArgumentType({
	commandType:    ApplicationCommandOptionType.String,
	commandOptions: { maxLength: MAX_TAG_LENGTH },
	regex:          /(^\w+[-_]?\w+$)/,
	normalizer:     flatten,
	finder:         (_, s) => {
		if (s.length > MAX_TAG_LENGTH) {
			throw new EmbedError(`Tag name is too long. Max tag length is ${inlineCode(String(MAX_TAG_LENGTH))}`);
		}

		return s;
	}
});

export const chunk = (arr, maxLength) => {
	const res = [];

	let tmp        = [];
	let currLength = 0;

	for (const e of arr) {
		currLength += e.length;

		if (currLength > maxLength) {
			res.push(tmp);
			currLength = 0;
			tmp        = [];
		}

		tmp.push(e);
	}

	if (tmp.length) {
		res.push(tmp);
	}

	return res;
};

export const autocomplete = dbFunc => {
	return async (interaction, input) => {
		const tags = await dbFunc({
			name:  input.value,
			guild: interaction.guild,
			user:  interaction.user,
			max:   AUTOCOMPLETE_MAX,
		});

		return interaction.respond(tags.map(t => ({
			name:  `${t.name} (${t.numSubscriptions} subs)`,
			value: t.name,
		})));
	};
};

// const _autocomplete = async (interaction, input) => {
// 	const tags = await searchTag({
// 		name:  input.value,
// 		guild: interaction.guild,
// 		user: interaction.user,
// 		max:   AUTOCOMPLETE_MAX,
// 	});
//
// 	return interaction.respond(tags.map(t => ({
// 		name:  `${t.name} (${t.numSubscriptions} subs)`,
// 		value: t.name,
// 	})));
// };
