const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'moderation',
            memberName: 'kick',
            description: 'Kicks mentioned users',
            userPermissions: ['KICK_MEMBERS'],
            examples: [`${client.commandPrefix}kick @user`, `${client.commandPrefix}kick @user1 @user2 @user3`],
            guildOnly: true
        });
    };

    async run(message) {
        if (message.mentions.members.size) {
            message.mentions.members.tap(member => {
                if (member.bannable) {
                    member.kick().then(() => {
                        message.embed(new RichEmbed()
                            .setColor('GREEN')
                            .setTitle(`User ${member.user.tag} has been kicked by ${message.author.tag}.`)
                        );
                    }).catch(() => {
                        message.channel.send(new RichEmbed()
                            .setColor('ORANGE')
                            .setTitle(`User ${member.user.tag} was not kicked. Reason: unknown.`)
                    )});
                } else {
                    return message.channel.send(new RichEmbed()
                        .setColor('ORANGE')
                        .setTitle(`User ${member.user.tag} was not kicked. Reason: bot cannot kicked that member.`)
                    );
                }
            });
        } else {
            return message.channel.send(new RichEmbed()
                .setColor('RED')
                .setTitle(`Please mention users to kick.`)
            );
        }
    }
}
