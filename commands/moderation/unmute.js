const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const guildMemberUnmuted = require('../../events/guildMemberUnmuted');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            group: 'moderation',
            memberName: 'unmute',
            description: 'Unmutes mentioned users',
            userPermissions: ['MANAGE_GUILD'],
            examples: [`${client.commandPrefix}unmute @user`, `${client.commandPrefix}unmute @user1 @user2 @user3]`],
            guildOnly: true
        });
    }

   async run(message) {
       const entry = message.client.provider.get(message.guild, 'mutedRole', false);
       if (!entry) {
           return roleNotFound(message);
        } else {
            const mutedRole = message.guild.roles.find(val => val.id === entry);
            if (!mutedRole) {
                roleNotFound(message);
            } else {
                if (message.mentions.members.size) {
                    return message.channel.send(new RichEmbed()
                        .setColor('ORANGE')
                        .setTitle('Please mention members to unmute')
                    );
                } else {
                    message.mentions.members.tap(member => {
                        if (!member.roles.has(mutedRole.id)) {
                            return message.embed(new RichEmbed()
                                .setColor('ORANGE')
                                .setDescription(`**Member ${member.toString()} is not muted**`)
                            )
                        } else {
                            member.removeRole(mutedRole).then(member => {
                                message.channel.send(new RichEmbed()
                                    .setColor('GREEN')
                                    .setDescription(`**Unmuted ${member.toString()}**`)
                                );
                                guildMemberUnmuted(member);
                            });
                        }
                    })
                }
            }
        }
    }
};

function roleNotFound(message) {
    return message.channel.send(new RichEmbed()
        .setColor('ORANGE')
        .addField('Muted role not found', 'Members cannot be muted if muted role is missing', false)
    );
};
