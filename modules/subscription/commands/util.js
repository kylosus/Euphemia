import { Formatters }     from 'discord.js';
import ArgumentType       from '../../../lib/Argument/ArgumentType.js';
import { flatten }        from '../../../lib/Argument/ArgumentTypeConstants.js';
import { MAX_TAG_LENGTH } from '../db.js';

export const TagArgType = new ArgumentType(/^\w+[-_]?\w+$/, flatten, (_, s) => {
	if (s.length > 25) {
		throw `Tag name is too long. Max tag length is ${Formatters.inlineCode(String(MAX_TAG_LENGTH))}`;
	}

	return s;
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
