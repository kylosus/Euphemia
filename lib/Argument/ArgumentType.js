export default class ArgumentType {
	constructor({
		commandType = null,
		commandOptions = {},
		multiple = false,
		member = false,
		regex,
		normalizer = _ => _,
		finder = (context, _) => _
	}) {
		this.commandType    = commandType;
		this.commandOptions = commandOptions;
		this.multiple       = multiple;
		this.member         = member;
		this.regex          = regex;
		this.normalizer     = normalizer;
		this.finder         = finder;
	}
}
