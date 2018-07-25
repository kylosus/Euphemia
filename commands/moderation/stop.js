const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'moderation',
            memberName: 'stop',
            description: 'Denies message sending perms for @everyone',
            userPermissions: ['MANAGE_GUILD'],
            examples: [`${client.commandPrefix}stop on`, `${client.commandPrefix}stop off`],
            guildOnly: true
        });
    }

   async run(message) {
       let args = message.content.split(' ');
       let everyone = message.guild.roles.find(val => val.position === 0);
        if (args[1] === 'on') {
            message.channel.overwritePermissions(everyone, { 'SEND_MESSAGES': false }).then(channel => {
                return message.embed(new RichEmbed()
                    .setColor('RED')
                    .setTitle('Channel locked down') 
                );
            });
        } else if (args[1] === 'off') {
            message.channel.overwritePermissions(everyone, { 'SEND_MESSAGES': true }).then(channel => {
                return message.embed(new RichEmbed()
                    .setColor('GREEN')
                    .setTitle('Channel locked') 
                );
            });
        } else {
            return message.embed(new RichEmbed()
                .setColor('ORANGE')
                .setTitle(`See ${message.client.commandPrefix}help stop`)
            );
        }
    }
};