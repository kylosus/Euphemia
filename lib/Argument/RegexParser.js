export default class RegexParser {
	constructor(regexes = (() => {throw new Error('No regex provided');})()) {
		this.regexes = regexes;
	}

	parse(string) {
		return this.regexes.map(r => {
			const temp = [];

			string = string.replace(r, args => {
				if (!args.length) {
					return '';
				}

				temp.push(args);
				return '';
			}).trim();

			return temp;
		});
	}
}
