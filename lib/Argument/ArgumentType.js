class ArgumentType {
	constructor(regex, normalizer = _ => _, finder = (context, _) => _) {
		this.regex = regex;
		this.normalizer = normalizer;
		this.finder = finder;
	}
}

module.exports = ArgumentType;
