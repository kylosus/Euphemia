const RegexParser = require('./RegexParser');

class ArgumentParser {
	constructor(args) {
		this.args = args;
		// this._ship = args.map(a => a.id).reduce((acc,curr) => (acc[curr]='', acc),{});

		// Not sure about this tbh
		this.args.forEach(a => {
			if (!a.message || !a.message.length) {
				console.warn(`Error message not provided for argument ${a.id}`);
				console.warn('Providing default message');

				a.message = (`Please provide an argument for '${a.id}'.`);
			}

			return a;
		});

		const regexes = this.args.map(a => {
			console.log(a.type);
			return a.type.regex;
		});
		this.parser = new RegexParser(regexes);
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
				ship[arg.id] = arg.default;
				continue;
			}

			const normalized = arg.type.normalizer(parsed[p]);
			ship[arg.id] = await arg.type.finder(message, normalized);
		}

		return ship;
	}
}

module.exports = ArgumentParser;
