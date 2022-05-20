import { MessageEmbed } from 'discord.js';

const GUILD_ID       = '292277485310312448';
const LOG_CHANNEL_ID = '294880275211747339';

const names = [
	/mod.*mail/i,
	/hype.*squad/i,
	/hype.*mail/i,
];

const watch = async user => {
	if (!names.find(n => n.test(user.username))) {
		return;
	}

	const guild = user.client.guilds.cache.get(GUILD_ID);
	const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);

	await guild.members.ban(user);

	return logChannel.send({
		embeds: [new MessageEmbed()
			.setColor('RED')
			.setTitle('🔨 User was automatically banned')
			.setThumbnail(user.displayAvatarURL())
			.setDescription(user.tag)
			.addField('ID', user.id, false)]
	});
};

export const init = client => {
	client.on('userUpdate', watch);
	client.on('guildMemberAdd', m => watch(m.user));
};
