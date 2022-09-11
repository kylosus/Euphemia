import { userMention, EmbedBuilder } from 'discord.js';

const DISCORD_LOGO = 'https://cdn.discordapp.com/attachments/540834912366755850/547465681453449246/discord-logo.png';

export default async guild => {
	console.log(`Joined ${guild.name} (${guild.id})`);

	return guild.client.owners.map(owner => {
		return owner.send({
			embeds: [new EmbedBuilder()
				.setColor(guild.client.defaultColor)
				.setImage(guild.iconURL() ?? DISCORD_LOGO)
				.setTitle('Bot has joined a new guild')
				.addFields(
					{ name: 'Guild name', value: guild.name, inline: true },
					{ name: 'Guild id', value: guild.id || '-', inline: true },
					{ name: 'Member count', value: String(guild.memberCount) || '-', inline: true },
					{ name: 'Owner', value: userMention(guild.ownerId), inline: true }
				)
			]
		});
	});
};
