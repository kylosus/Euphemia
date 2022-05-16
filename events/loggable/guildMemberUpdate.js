import { MessageEmbed } from 'discord.js';

export default async (channel, oldMember, newMember) => {
	if (oldMember.nickname !== newMember.nickname) {
		// Sorry
		const body = newMember.nickname ? `**${newMember.user.tag}** has changed their nickname` + (oldMember.nickname ? ` from **${oldMember.nickname}**` : '') + ` to **${newMember.nickname}**`
			: `**${newMember.user.tag}** has removed their nickname, **${oldMember.nickname}**`;

		return channel.send({
			embeds: [new MessageEmbed()
				.setColor(this.client.config.COLOR_OK)
				.setThumbnail(newMember.user.displayAvatarURL())
				.setTitle('Nickname change')
				.setDescription(body)
				.setTimestamp()]
		});
	}

	if (oldMember.user.tag !== newMember.user.tag) {
		return channel.send({
			embeds: [new MessageEmbed()
				.setColor(this.client.config.COLOR_OK)
				.setThumbnail(newMember.user.displayAvatarURL())
				.setTitle('Username change')
				.setDescription(`**${oldMember.user.tag}** has changed their username to **${newMember.user.tag}**`)
				.setTimestamp()]
		});
	}
};
