const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            group: 'moderation',
            memberName: 'purge',
            description: 'Purges a specified amount of messages',
            aliases: ['p'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true
        });
    }

   async run(message) {
       let args = message.content.split(' ');
       if (args.length < 2) {
           message.channel.fetchMessages({ limit: 2 }).then(messages => {
               let messageArray = messages.array();
               messageArray.forEach(message => {
                   message.delete();
               });
            });
            return;
       } else {
           let amount = parseInt(args[1]);
           if (amount > 100) {
               return message.embed(new RichEmbed()
                    .setColor('RED')
                    .setTitle('Please specify a smaller value')
                );
           } else {
                return message.channel.fetchMessages({ limit: ++amount }).then(messages => {
                    let messageArray = messages.array();
                    messageArray.forEach(message => {
                        message.delete();
                    });
                });
           }
        }
    }
};