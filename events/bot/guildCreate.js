const { RichEmbed }	= require('discord.js');
const DISCORD_LOGO	= 'https://cdn.discordapp.com/attachments/540834912366755850/547465681453449246/discord-logo.png';

module.exports = guild => {
	console.log(`Joined ${guild.name} (${guild.id})`);

	guild.client.owners.forEach(owner => {
		owner.send(new RichEmbed()
			.setColor(guild.client.defaultColor)
			.setImage(guild.iconURL() || DISCORD_LOGO)
			.setTitle('Bot has joined a new guild')
			.addField('Guild name', guild.name)
			.addField('Guild id', guild.id || '-')
			.addField('Member count', guild.memberCount || '-')
			.addField('Owner', guild.owner ? guild.owner.user.tag : guild.ownerID)
		);
	});
};
