const { RichEmbed } = require('discord.js');
module.exports = (member, Client) => {
    let entry = Client.provider.get(member.guild, 'guildMemberRemove', false)  
    if (entry.message && entry.channel) {
        let message = entry.message;
        message = JSON.parse(message.replace('$MENTION$', member.toString()).replace('$NAME$', member.user.tag).replace('$MEMBER_COUNT$', member.guild.memberCount).replace('$AVATAR$', member.user.avatarURL))
        member.guild.channels.find(val => val.id === entry.channel).send(message.content, new RichEmbed(message));
    }
    if (entry.log) {
        member.guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
            .setColor('BLUE')
            .setTitle(`❌ User left`)
            .setThumbnail(member.user.avatarURL)
            .setDescription(`${member.toString()} \`${member.user.tag}\``)
            .addField('ID', member.id, false)
            .setTimestamp(member.joinedAt)
        );
    }
}