const EuphemiaEmbed = require('../util/EuphemiaEmbed.js');
const { RichEmbed } = require('discord.js');

module.exports = (member, Client) => {
    const entry = Client.provider.get(member.guild, 'guildMemberRemove', false)  
    if (entry.message && entry.channel) {
        const message = entry.message.replace('$MENTION$', member.toString()).replace('$NAME$', member.user.tag).replace('$MEMBER_COUNT$', member.guild.memberCount).replace('$AVATAR$', member.user.avatarURL || member.user.defaultAvatarURL);
        const embed = EuphemiaEmbed.build(message);
        if (embed) {
            member.guild.channels.find(val => val.id === entry.channel).send([embed.content], embed);
        }
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