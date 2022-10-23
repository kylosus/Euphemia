import { EmbedBuilder } from 'discord.js';

export const resolveMessageArg = (text) => {
	try {
		const json = JSON.parse(text);
		return { content: json.content, embeds: [new EmbedBuilder(json)] };
	} catch (err) {
		return { content: text };
	}
};
