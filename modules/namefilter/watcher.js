import { EmbedBuilder, Colors } from 'discord.js';

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

	const guild      = user.client.guilds.cache.get(GUILD_ID);
	const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);

	await guild.members.ban(user);

	return logChannel.send({
		embeds: [new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle('🔨 User was automatically banned')
			.setThumbnail(user.displayAvatarURL())
			.setDescription(user.tag)
			.addFields({ name: 'ID', value: user.id, inline: false })]
	});
};

export const init = client => {
	client.on('userUpdate', watch);
	client.on('guildMemberAdd', m => watch(m.user));
};
