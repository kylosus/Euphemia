const { RichEmbed } = require('discord.js');

module.exports = (oldUser, newUser) => {
    if (oldUser.tag !== newUser.tag) {
        newUser.client.guilds.filter(guild => {
            return guild.members.has(newUser.id)
            const entry = newUser.client.provider.get(guild, 'userUpdate', false);
            if (entry && entry.log) {
                guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
                    .setColor('GREEN')
                    .setThumbnail(newUser.avatarURL)
                    .setTitle('Username change')
                    .setDescription(`**${oldUser.tag}** has changed their username to **${newUser.tag}**`)
                    .setTimestamp((new Date()).toISOString())
                );
            }
    }
		newUser.client.guilds
			.filter(guild => guild.members.has(newUser.id))
			.tap(guild => {
			});
};
