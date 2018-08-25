const { RichEmbed } = require('discord.js');
module.exports = (guild, user) => {
    const entry = guild.client.provider.get(guild, 'guildBanRemove', false);
    if (entry.log) {
        guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
            .setColor('GREEN')
            .setTitle('♻ User unbanned')
            .setThumbnail(user.avatarURL)
            .setDescription(user.tag)
            .addField('ID', user.id, false)
        );
    }
}
