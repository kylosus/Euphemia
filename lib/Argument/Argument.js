export const AUTOCOMPLETE_MAX = 25;

export default class ArgumentType {
	constructor({
		id,
		type,
		description = id,
		optional = false,
		defaultFunc,
		message,
		choices = [],
		autocomplete = false
	}) {
		this.id          = id;
		this.type        = type;
		this.description = description;
		this.optional    = optional;
		this.defaultFunc = defaultFunc;
		this.message     = message;

		// Slash stuff
		this.choices          = choices.map(o => ({ name: o?.name ?? o, value: o?.value ?? o }));
		this.autocomplete     = Boolean(autocomplete);
		this.autocompleteFunc = autocomplete;
	}

	get slashOptions() {
		return {
			name:         this.id,
			type:         this.type.commandType,
			description:  this.description ?? this.id,
			choices:      this.choices,
			autocomplete: this.autocomplete,
			required:     !this.optional,
			...this.type.commandOptions
		};
	}
}
