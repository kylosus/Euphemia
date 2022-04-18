import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { makeError }                                     from '../../lib/ECommand.js';

const register = async (message, decisions = [{
	component: new MessageButton(),
	// eslint-disable-next-line no-unused-vars
	action: async (interaction) => {
	}
}]) => {
	const buttons = new MessageActionRow();

	decisions.forEach(d => buttons.addComponents(d.component));

	const newMessage = await message.edit({ components: [buttons] });

	newMessage.createMessageComponentCollector({
		filter: async interaction => {
			if (!interaction.isButton()) {
				return;
			}

			const decision = decisions.find(d => interaction.customId === d.component.customId);

			if (!decision) {
				return;
			}

			// Shit just works
			try {
				const result = await decision.action(interaction);
				await interaction.reply({
					ephemeral: true, embeds: [new MessageEmbed()
						.setColor('GREEN')
						.setDescription(result)]
				});
			} catch (err) {
				const embed = makeError(err.message || err || 'An unknown error occurred');
				interaction.reply({ ephemeral: true, embeds: [embed] }).catch(console.warn);
			}
		}
	});

	return newMessage;
};

export {
	register
};
