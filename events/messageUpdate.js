const moment 		= require('moment');
const { RichEmbed } = require('discord.js');

module.exports = (oldMessage, newMessage) => {

    if (oldMessage.content == newMessage.content || !oldMessage.content || !newMessage.content) {
        return;
    }

    const entry = newMessage.client.provider.get(newMessage.guild, 'messageUpdate', false);

    if (entry && entry.log) {

        if (oldMessage.content.length >= 1020) {
            oldMessage.content = oldMessage.content.substring(0, 1020) + '...';
        }

        if (newMessage.content.length >= 1020) {
            newMessage.content = newMessage.content.substring(0, 1020) + '...';
        }

        return newMessage.guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
            .setColor('PURPLE')
            .setTitle(`🖊 Message edited in #${newMessage.channel.name}`)
            .setDescription(`${newMessage.member.toString()} \`${newMessage.author.id}\``)
            .addField('Old message', oldMessage.content, false)
            .addField('New message', newMessage.content, false)
            .addField('ID', oldMessage.id, false)
            .setTimestamp(moment().toISOString())
        );
    }
};
