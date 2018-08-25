const { RichEmbed } = require('discord.js');

module.exports = member => {
    const entry = member.client.provider.get(member.guild, 'guildMemberUnmuted', false)
    if (entry && entry.log) {
        return member.guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
            .setColor('GOLD')
            .setTitle('🔈 User unmuted')
            .setThumbnail(member.user.avatarURL)
            .addField('User', `${member.toString()} \`${member.id}\``, false)
        );
    }
}
