import { MessageEmbed } from 'discord.js';

const onMemberAdd = client => {
	client.on('guildMemberAdd', async member => {
		if (!member.guild.autokick) {
			return;
		}

		await member.send({
			embeds: [new MessageEmbed()
				.setColor('DARK_RED')
				.setTitle(`You have been kicked automatically from ${member.guild.name}`)
				.setDescription('We are currently being raided. Please join back later. Sorry for the inconvenience caused.')
			]
		}).catch(_ => _);

		return await member.kick().catch(_ => _);
	});
};

export const init = client => {
	onMemberAdd(client);
};
