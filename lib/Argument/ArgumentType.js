export default class ArgumentType {
	constructor({ commandType = null, multiple = false, regex, normalizer = _ => _, finder = (context, _) => _ }) {
		this.commandType = commandType;
		this.multiple    = multiple;
		this.regex       = regex;
		this.normalizer  = normalizer;
		this.finder      = finder;
	}
}
