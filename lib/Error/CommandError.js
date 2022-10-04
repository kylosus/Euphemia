import { EmbedError } from './EmbedError.js';

class CommandError extends EmbedError {
	constructor(message) {
		super(message);
	}

	makeEmbed() {
		return super.makeEmbed().setDescription(this.message);
	}
}