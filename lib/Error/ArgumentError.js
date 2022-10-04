import { EmbedError } from './EmbedError.js';
import { codeBlock }  from 'discord.js';

export class ArgumentError extends EmbedError {
	constructor(message, command) {
		super(message);

		this.command = command;
	}

	makeEmbed() {
		return super.makeEmbed()
			.setTitle(this.message)
			.setDescription(null)
			.addFields({ name: 'Arguments', value: codeBlock(this.command.description.usage) })
			.addFields({ name: 'Example', value: codeBlock(this.command.description.examples.join('\n')) });
	}
}