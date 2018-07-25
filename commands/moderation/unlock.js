const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'unlock',
            group: 'moderation',
            memberName: 'unlock',
            description: 'Gives back @everyone message sending perms, if the chanel is locked',
            aliases: ['ul'],
            userPermissions: ['MANAGE_GUILD'],
            guildOnly: true
        });
    }

   async run(message) {
       let everyone = message.guild.roles.find(val => val.position === 0);
       message.channel.overwritePermissions(everyone, { 'SEND_MESSAGES': true});
       return message.embed(new RichEmbed()
                .setColor('GREEN')
                .setTitle('Unlocked the channel') 
        );
    }
};