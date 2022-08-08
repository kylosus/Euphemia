import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

// const COLLECTOR_TIME = 150000;
const FORWARD_EMOJI  = '➡';
const BACKWARD_EMOJI = '⬅';

const _FORWARD_EMOJI  = '>';
const _BACKWARD_EMOJI = '<';

const _watcher = ({ message, generator, args }) => {
	message.createMessageComponentCollector({
		filter: async interaction => {
			if (!interaction.isButton()) {
				return;
			}

			if (interaction.customId === _BACKWARD_EMOJI) {
				const embed = generator(await args.previous())
					.setFooter({ text: `${args.currentIndex + 1}/${args.length}` });

				message.edit({ embeds: [embed] });
			}

			if (interaction.customId === _FORWARD_EMOJI) {
				const current = await args.next();

				const embed = generator(current)
					.setFooter({ text: `${args.currentIndex + 1}/${args.length}` });

				message.edit({ embeds: [embed] });
			}

			await interaction.deferUpdate();
		}
	});
};

const register = async (message, generator, args) => {
	const current = await args.current;

	const firstEmbed = generator(current)
		.setFooter({ text: `1/${args.length}` });

	if (args.length === 1) {
		return message.channel.send({ embeds: [firstEmbed] });
	}

	const buttons = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId(_BACKWARD_EMOJI)
				.setLabel(_BACKWARD_EMOJI)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(_FORWARD_EMOJI)
				.setLabel(_FORWARD_EMOJI)
				.setStyle(ButtonStyle.Secondary)
		);

	const botMessage = await message.channel.send({ embeds: [firstEmbed], components: [buttons] });

	_watcher({ message: botMessage, generator, args });
};

export {
	BACKWARD_EMOJI,
	FORWARD_EMOJI,
	register
};
