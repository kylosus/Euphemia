const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const guildMemberMuted = require('../../events/guildMemberMuted');
const guildMemberUnmuted = require('../../events/guildMemberUnmuted');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'moderation',
            memberName: 'mute',
            description: 'Mutes mentioned users for a given amount of minutes',
            userPermissions: ['MANAGE_GUILD'],
            examples: [`${client.commandPrefix}mute 5 @user`, `${client.commandPrefix}mute @user1 @user2 @user3]`],
            guildOnly: true
        });
    }

   async run(message) {
        const args = message.content.split(' ');
        if (args[1] === 'set') {
            const input = message.content.substring(10);
            const role =  message.guild.roles.find(val => val.name == input);
            if (role) {
                return setRole(message, this.client.provider, message.guild, role);
            } else if (/^\d+$/.test(args[1])) {
                const role =  message.guild.roles.find(val => val.id === args[1]);
                if (role) {
                    return setRole(message, message.client.provider, message.guild, role);
                }
            } else {
                return message.embed(new RichEmbed()
                    .setColor('ORANGE')
                    .setTitle('Role not found')
                );
            }
        } else if (!message.mentions.members.size) {
            return message.embed(new RichEmbed()
                .setColor('ORANGE')
                .setTitle('Please mention members to mute')
            );
        } else {
            let timeout;
            if (/^\d+$/.test(args[1])) {
                timeout = parseInt(args[1]);
            }
            const role = checkAndCreateRole(message);
            const body = `has been muted` + (timeout? ` for ${timeout} minutes` : ``);
            message.mentions.members.tap(member => {
                if (member.roles.has(role.id)) {
                    return message.embed(new RichEmbed()
                        .setColor('ORANGE')
                        .setDescription(`**Member ${member.toString()} is already muted**.`)
                    )
                }
                member.addRole(role).then(member => {
                    message.channel.send(new RichEmbed()
                        .setColor('GREEN')
                        .setDescription(`Member ${member.toString()} ${body}`)
                    );
                    guildMemberMuted(member, timeout);
                    if (timeout) {
                        message.client.setTimeout((member, role, guildMemberUnmuted) => {
                        member.removeRole(role).then(member => {
                            guildMemberMuted(member, timeout)
                            guildMemberUnmuted(member);
                        });
                        }, (timeout || 0) * 60000, member, role, guildMemberUnmuted);
                    }
                });
            });
        }
    }
};

function setRole(message, provider, guild, role) {
    if (role.position >= guild.me.highestRole.position) {
        return message.channel.send(new RichEmbed()
            .setColor('ORANGE')
            .setTitle('Role cannot be assigned as the mute role because it is higher than, or equal to the bot in the hierarchy.')
        );
    }
    provider.set(guild, 'mutedRole', role.id);
    return message.channel.send(new RichEmbed()
        .setColor('GREEN')
        .setTitle(`Mute role set to ${role.name}.`)
    );
};

function checkAndCreateRole(message) {
    const entry = message.client.provider.get(message.guild, 'mutedRole', false);
    const role = message.guild.roles.find(val => val.id === entry);
    if (role) {
        return role;
    }
    if (!entry) {
        message.guild.createRole({
            name: `${message.client.user.username}-mute`,
            position: message.guild.me.highestRole.position - 1,
            permissions: 66560
        }).then(role => {
            message.channel.send(new RichEmbed()
                .setColor('BLUE')
                .setTitle(`Created new role ${role.name}.`)
            );
            setRole(message, message.client.provider, message.guild, role);
            return role;
        });
    }
};
