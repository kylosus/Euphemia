const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { getField } = require('../../util/databaseHandler.js');
const moduleHandler = module => require(`./modules/${module}`);
const _ = require('lodash');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'tag',
            group: 'subscription',
            memberName: 'tag',
            description: 'Mentions users subscribed to a tag',
            examples: [`${client.commandPrefix}tag Clannad`],
            throttling: {
                usages: 1,
                duration: 60
            },
            guildOnly: true
        });
    }

    async run(message) {
        const tag = message.content.split(' ').splice(1).join(' ').toLowerCase();
        const collection = this.client.database.collection('subscriptions');
        if (tag) {
            collection.findOne({_id: message.guild.id, [tag]: {$exists: true}}).then(entry => {
                if (entry) {
                    const users = entry[tag].map(user => `<@${user}>`);
                    if (users.length) {
                        const messages = _.chunk(users, 90);
                        let first = true;
                        messages.forEach(chunk => {
                            if (first) {
                                message.channel.send(`🌸 **Users subscribed to ${tag}**\n${chunk.join(' ')}`);
                            } else {
                                message.channel.send(chunk.join(' '));
                            }
                        })
                    } else {
                        return message.channel.send(new RichEmbed()
                            .setColor('RED')
                            .setTitle(`Tag ${tag} does not any members subscribed to it`)
                        );
                    }
                } else {
                    return message.channel.send(new RichEmbed()
                        .setColor('RED')
                        .setTitle(`Tag ${tag} does not exist`)
                    );
                }
            })
        } else {
            return message.channel.send(new RichEmbed()
                .setColor('RED')
                .setTitle(`Please mention a tag`)
            );
        }
    }
};
