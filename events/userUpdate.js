const { RichEmbed } = require('discord.js');

module.exports = (oldUser, newUser) => {
    if (oldUser.tag !== newUser.tag) {
        let entry;
        newUser.client.guilds.filter(guild => {
            return guild.members.has(newUser.id)
        }).array().forEach(guild => {
            entry = newUser.client.provider.get(guild, 'userUpdate', false);
            if (entry && entry.log) {
                guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
                    .setColor('GREEN')
                    .setThumbnail(newUser.avatarURL)
                    .setTitle('Username change')
                    .setDescription(`**${oldUser.tag}** has changed their username to **${newUser.tag}**`)
                    .setTimestamp((new Date()).toISOString())
                );
            }
        });
    }
}