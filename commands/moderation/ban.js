const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'moderation',
            memberName: 'ban',
            description: 'Bans mentioned users',
            userPermissions: ['BAN_MEMBERS'],
            examples: [`${client.commandPrefix}ban @user`, `${client.commandPrefix}ban @user1 @user2 @user3`],
            guildOnly: true
        });
    };

    async run(message) {
        if (message.mentions.members.size) {
            message.mentions.members.tap(member => {
                if (member.bannable) {
                    member.ban(0).then(() => {
                        message.channel.send(new RichEmbed()
                            .setColor('GREEN')
                            .setTitle(`User ${member.user.tag} has been banned by ${message.author.tag}.`)
                        );
                    }).catch(() => {
                        message.channel.send(new RichEmbed()
                            .setColor('ORANGE')
                            .setTitle(`User ${member.user.tag} was not banned. Reason: unknown.`)
                    )});
                } else {
                    message.channel.send(new RichEmbed()
                        .setColor('ORANGE')
                        .setTitle(`User ${member.user.tag} was not banned. Reason: bot cannot ban that member.`)
                    )
                }
            });
        } else {
            return message.channel.send(new RichEmbed()
                .setColor('RED')
                .setTitle(`Please mention users to ban.`)
            );
        }
    }
}
