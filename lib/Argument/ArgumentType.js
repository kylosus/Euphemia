export default class ArgumentType {
	constructor({ commandType = null, multiple = false, member = false, regex, normalizer = _ => _, finder = (context, _) => _ }) {
		this.commandType = commandType;
		this.multiple    = multiple;
		this.member      = member;
		this.regex       = regex;
		this.normalizer  = normalizer;
		this.finder      = finder;
	}
}
