import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import { makeError }                                     from '../../lib/ECommand.js';
import { BotConfig }                                     from '../../config/config.js';

const register = async (message, decisions = [{
	component: new ButtonBuilder(),
	// eslint-disable-next-line no-unused-vars
	action: async (interaction) => {
	}
}], collectorOptions                       = {}) => {
	const buttons = new ActionRowBuilder();

	decisions.forEach(d => buttons.addComponents(d.component));

	const newMessage = await message.edit({ components: [buttons] });

	newMessage.createMessageComponentCollector({
		filter: async interaction => {
			if (!interaction.isButton()) {
				return;
			}

			const decision = decisions.find(d => interaction.customId === d.component.data.custom_id);

			if (!decision) {
				return;
			}

			// Shit just works
			try {
				const result = await decision.action(interaction);

				// The caller is doing other stuff
				if (!result) {
					interaction.deferUpdate().catch(() => {
					});
					return;
				}

				await interaction.reply({
					ephemeral: true, embeds: [new EmbedBuilder()
						.setColor(BotConfig.COLOR_OK)
						.setDescription(result)]
				});
			} catch (err) {
				const embed = makeError(err.message || err || 'An unknown error occurred');
				interaction.reply({ ephemeral: true, embeds: [embed] }).catch(() => {
				});
			}
		},
		...collectorOptions
	});

	return newMessage;
};

export {
	register
};
