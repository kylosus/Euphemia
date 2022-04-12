import RegexParser from './RegexParser.js';

export default class ArgumentParser {
	constructor(args) {
		this.args = args;
		// Not sure about this tbh
		this.args.forEach(a => {
			if (!a.message || !a.message.length) {
				a.message = (`Please provide an argument for '${a.id}'.`);
			}

			if (!a.default) {
				a.default = () => undefined;
			}

			return a;
		});

		const regexes = this.args.map(a => {
			return a.type.regex;
		});
		this.parser   = new RegexParser(regexes);
	}

	async parse(message, text) {
		const ship = {};

		const parsed = this.parser.parse(text);
		for (let p in parsed) {
			const arg = this.args[p];

			if (!parsed[p].length) {
				if (!arg.optional) {
					throw arg.message;
				}

				// ship[arg.id] = arg.default || '';
				ship[arg.id] = arg.default(message);
				continue;
			}

			const normalized = arg.type.normalizer(parsed[p]);
			ship[arg.id]     = await arg.type.finder(message, normalized);
		}

		return ship;
	}
}
