import { EmbedBuilder } from 'discord.js';

const CHANNEL = '702949061216698388';

const interactionCreate = client => {
	client.on('interactionCreate', async interaction => {
		if (interaction.channel?.id !== CHANNEL) {
			return;
		}

		const roles = await Promise.all(interaction.values.map(id => interaction.guild.roles.fetch(id)));

		if (!roles.length) {
			throw 'Roles not found';
		}

		await interaction.member.roles.add(roles);

		interaction.reply({
			ephemeral: true, embeds: [
				new EmbedBuilder()
					.setColor(client.config.COLOR_OK)
					.setTitle('Assigned roles')
					.setDescription(roles.map(r => r.toString()).join('\n'))
			]
		});
	});
};

export const init = client => {
	interactionCreate(client);
};
