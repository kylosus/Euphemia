const { RichEmbed } = require('discord.js');

module.exports = (oldUser, newUser) => {
    if (oldUser.tag !== newUser.tag) {
        newUser.client.guilds.filter(guild => {
            return guild.members.has(newUser.id)
            const entry = newUser.client.provider.get(guild, 'userUpdate', false);
            if (entry && entry.log) {
                guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
                );
            }
		newUser.client.guilds
			.filter(guild => guild.members.has(newUser.id))
			.tap(guild => {
					}

					channel.send(new RichEmbed()
						.setColor('GREEN')
			});
				const channel = guild.channels.get(entry.log);

				if (!channel) {
					return;
				}
};
