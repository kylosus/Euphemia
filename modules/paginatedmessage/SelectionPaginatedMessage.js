import { ActionRowBuilder, SelectMenuBuilder } from 'discord.js';

const _watcher = ({ message, generator, options }) => {
	// handle errors!
	message.createMessageComponentCollector({
		filter: async interaction => {
			if (!interaction.isSelectMenu()) {
				return;
			}

			// Possibly unsafe
			const embed = generator(options[interaction.values[0]].data);
			message.edit({ embeds: [embed] });

			await interaction.deferUpdate();
		}
	});
};

const _watcher_interaction = ({ originalInteraction, interactionReply, generator, options }) => {
	// handle errors!
	return interactionReply.createMessageComponentCollector({
		filter: async interaction => {
			if (!interaction.isSelectMenu()) {
				return;
			}

			// Possibly unsafe
			const embed = generator(options[interaction.values[0]].data);
			originalInteraction.editReply({ embeds: [embed] });

			await interaction.deferUpdate();
		}
	});
};

const register = async (message, generator, options) => {
	const current = options[0].data;

	const firstEmbed = generator(current);

	// if (options.length === 1) {
	// 	return message.reply({ embeds: [firstEmbed] });
	// }

	const selectMenu = new SelectMenuBuilder()
		.setCustomId('select')
		.addOptions(
			options.map(({ label }, index) => ({ label, value: String(index) }))	// shit ass api
		);

	const row = new ActionRowBuilder().addComponents(selectMenu);

	const botMessage = await message.reply({ embeds: [firstEmbed], components: [row] });

	// ?????
	if (message.isChatInputCommand()) {
		return _watcher_interaction({
			originalInteraction: message,
			interactionReply: botMessage,
			generator,
			options
		});
	}

	return _watcher({ message: botMessage, generator, options });
};

export {
	register
};
