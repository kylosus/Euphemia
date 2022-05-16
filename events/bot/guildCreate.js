import { Formatters, MessageEmbed } from 'discord.js';

const DISCORD_LOGO = 'https://cdn.discordapp.com/attachments/540834912366755850/547465681453449246/discord-logo.png';

export default async guild => {
	console.log(`Joined ${guild.name} (${guild.id})`);

	return guild.client.owners.map(owner => {
		return owner.send({
			embeds: [new MessageEmbed()
				.setColor(guild.client.defaultColor)
				.setImage(guild.iconURL() ?? DISCORD_LOGO)
				.setTitle('Bot has joined a new guild')
				.addField('Guild name', guild.name, true)
				.addField('Guild id', guild.id || '-', true)
				.addField('Member count', String(guild.memberCount) || '-', true)
				.addField('Owner', Formatters.userMention(guild.ownerId), true)]
		});
	});
};
