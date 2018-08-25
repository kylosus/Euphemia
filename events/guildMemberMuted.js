const { RichEmbed } = require('discord.js');

module.exports = (member, duration) => {
    duration = duration? duration : '-';
    const entry = member.client.provider.get(member.guild, 'guildMemberMuted', false)
    if (entry && entry.log) {
        return member.guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
            .setColor('GOLD')
            .setTitle('🔇User muted')
            .setThumbnail(member.user.avatarURL)
            .addField('User', `${member.toString()} \`${member.id}\``, false)
            .addField('Duration', `${duration} minutes`)
        );
    }
}
