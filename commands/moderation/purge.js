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
            clientPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true
        });
    }

    async run(message) {
        const args = message.content.split(' ');
        if (args.length === 1) {
            message.channel.fetchMessages({ limit: 2 }).then(messages => {
                message.channel.bulkDelete(messages);
            });
        } else {
            const count = Math.min((parseInt(args[1]) || 0) + 1, 100);

            const deleted = await message.channel.bulkDelete(count);
            const reply = await message.channel.send(new RichEmbed()
                .setColor('GREEN')
                .setTitle(`Deleted ${deleted.size} messages`)
            );

            this.client.setTimeout((reply) => {
                reply.delete();
            }, 2000, reply);
        }
    }
};
