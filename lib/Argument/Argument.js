export default class ArgumentType {
	constructor({ id, type, description = id, optional = false, defaultFunc, message }) {
		this.id          = id;
		this.type        = type;
		this.description = description;
		this.optional    = optional;
		this.defaultFunc = defaultFunc;
		this.message     = message;
	}

}
