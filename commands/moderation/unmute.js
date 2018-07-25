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
       let mutedRole = message.client.provider.get(message.guild, 'mutedRole', false);
       if (!mutedRole) {
           return roleNotFound(message);
        } else {
            mutedRole = message.guild.roles.find(val => val.id === mutedRole);
            if (!mutedRole) {
                roleNotFound(message);
            } else {
                if (!message.mentions.members) {
                    return message.embed(new RichEmbed()
                        .setColor('ORANGE')
                        .setTitle('Please mention members to unmute')
                    );
                } else {
                    let mentions = message.mentions.members.array();
                    mentions.forEach(member => {
                        if (!member.roles.has(mutedRole.id)) {
                            return message.embed(new RichEmbed()
                                .setColor('ORANGE')
                                .setDescription(`**Member ${member.toString()} is not muted**`)
                            )
                        } else {
                            member.removeRole(mutedRole).then(member => {
                                message.embed(new RichEmbed()
                                    .setColor('GREEN')
                                    .setDescription(`**Unmuted ${member.toString()}**`)
                                );
                                guildMemberUnmuted(member);
                            })
                        }
                    })
                }
            }
        }
    }
};

function roleNotFound(message) {
    return message.embed(new RichEmbed()
        .setColor('ORANGE')
        .addField('Muted role not found', 'Members cannot be muted if (un)muted role is missing', false)
    );
}