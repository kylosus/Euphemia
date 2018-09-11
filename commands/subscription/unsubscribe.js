const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'unsubscribe',
            group: 'subscription',
            memberName: 'unsubscribe',
            description: 'Unsubscribes user from a tag',
            examples: [`${client.commandPrefix}unsubscribe Clannad`],
            aliases: ['unsub'],
            guildOnly: true
        });
    }

    async run(message) {
        const tag = message.content.split(' ').splice(1).join(' ').toLowerCase();
        const collection = this.client.database.collection('subscriptions');
        if (tag) {
            collection.findOne({_id: message.guild.id, [tag]: {$exists: true}}).then(entry => {
                if (entry) {
                    collection.updateOne(
                        {_id: message.guild.id},
                        {$pull: {[tag]: message.author.id}}
                    ).then(commandResult => {
                        if (commandResult.result.nModified) {
                            return message.channel.send(new RichEmbed()
                                .setColor('GREEN')
                                .setTitle(`Unsubscribed from ${tag}`)
                            );
                        } else {
                            return message.channel.send(new RichEmbed()
                                .setColor('ORANGE')
                                .setTitle(`You are not subscribed to ${tag}`)
                            );
                        }
                    });
                } else {
                    return message.channel.send(new RichEmbed()
                        .setColor('RED')
                        .setTitle(`Tag ${tag} does not exist`)
                    );
                }
            })
        } else {
            return message.channel.send(new RichEmbed()
                .setColor('ORANGE')
                .setTitle(`Please mention a tag to unsubscribe from`)
            );
        }
    }
};
