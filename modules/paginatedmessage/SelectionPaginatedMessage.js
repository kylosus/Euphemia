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

	const botMessage = await message.channel.send({ embeds: [firstEmbed], components: [row] });

	_watcher({ message: botMessage, generator, options });
};

export {
	register
};
