import { EmbedBuilder } from 'discord.js';
import { BotConfig }    from '../../config/config.js';

export class EmbedError extends Error {
	constructor(message = 'An unknown error occurred') {
		super(message.message ?? message);
	}

	get baseEmbed() {
		return new EmbedBuilder().setColor(BotConfig.COLOR_NO);
	}

	makeEmbed() {
		return this.baseEmbed
			.setDescription(`${BotConfig.EMOJI_NO} ${this.message}`);
	}
}