const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'cache',
            group: 'moderation',
            memberName: 'cache',
            description: 'Caches messages in a channel',
            examples: [`${client.commandPrefix}cache`],
            guildOnly: true,
            ownerOnly: true
        });
    };

    async run(message) {
        message.channel.fetchMessages({limit: 100});
        message.delete();
        return message.embed(new RichEmbed()
            .setColor('GREEN')
            .setDescription('👌')
        ).then(reply => reply.delete());
    }
}
