const { RichEmbed } = require('discord.js');

module.exports = message => {
    if (message.author.id === message.client.user.id) {
        message.client.messageStats.sent++
    } else {
        message.client.messageStats.received++;
    }

    if (!message.guild && !message.author.bot) {
        if (message.client.owners) {
        message.client.owners.forEach(owner => {
                if (!message.client.isOwner(message.author)) {
                    owner.send(new RichEmbed()
                        .setColor('BLUE')
                        .setTitle('Bot has received a DM')
                        .addField(message.author.tag, message.content || '-')
                    );
                }
            });
        }
    }
};
