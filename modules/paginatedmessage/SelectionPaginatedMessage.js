import { MessageActionRow, MessageSelectMenu } from 'discord.js';

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
	// 	return message.channel.send({ embeds: [firstEmbed] });
	// }

	const selectMenu = new MessageSelectMenu()
		.setCustomId('select')
		.addOptions(
			options.map(({ label }, index) => ({ label, value: String(index) }))	// shit ass api
		);

	const row = new MessageActionRow().addComponents(selectMenu);

	const botMessage = await message.channel.send({ embeds: [firstEmbed], components: [row] });

	_watcher({ message: botMessage, generator, options });
};

export {
	register
};
