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
       const args = message.content.split(' ');
       if (args.length == 1) {
           message.channel.fetchMessages({ limit: 2 }).then(messages => {
               messages.tap(message => {
                   message.delete();
               });
            });
            return;
       } else {
           const amount = parseInt(args[1]);
           if (amount > 100) {
               return message.embed(new RichEmbed()
                    .setColor('RED')
                    .setTitle('Please specify a smaller value')
                );
           } else {
                return message.channel.fetchMessages({ limit: (amount === 100)? amount : amount++ }).then(messages => {
                    messages.tap(message => {
                        message.delete();
                    });
                });
           }
        }
    }
};
