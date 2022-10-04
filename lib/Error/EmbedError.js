import { EmbedBuilder } from 'discord.js';
import { BotConfig }    from '../../config.js';

export class EmbedError extends Error {
	constructor(message = 'An unknown error occurred') {
		super(message.message ?? message);
	}

	makeEmbed() {
		return new EmbedBuilder()
			.setColor(BotConfig.COLOR_NO)
			.setDescription(`${BotConfig.EMOJI_NO} ${this.message}`);
	}
}