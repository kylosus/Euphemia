export default class RegexParser {
	constructor(regexes = (() => {throw new Error('No regex provided');})()) {
		this.regexes = regexes;
	}

	parse(string) {
		return this.regexes.map(r => {
			const temp = [];

			string = string.replace(r, (_, p1) => {
				if (!p1.length) {
					return '';
				}

				temp.push(p1);
				return '';
			}).trim();

			return temp;
		});
	}
}
