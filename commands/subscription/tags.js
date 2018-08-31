const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const _ = require('lodash');
const EuphemiaPaginatedMessage = require('../../util/EuphemiaPaginatedMessage.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'tags',
            group: 'subscription',
            memberName: 'tags',
            description: 'Lists available tags',
            examples: [`${client.commandPrefix}tags`],
            guildOnly: true
        });
    }

    async run(message) {
        const collection = this.client.database.collection('subscriptions');
        collection.findOne({_id: message.guild.id}, {projection: { _id: 0 }}).then(entry => {
            if (entry) {
                const tags = Object.keys(entry);
                if (tags.length) {
                    const messages = _.chunk(tags, 20);
                    return EuphemiaPaginatedMessage(messages.map(chunk => new RichEmbed()
                            .setTitle('List of available tags')
                            .setColor(global.BOT_DEFAULT_COLOR)
                            .setDescription(chunk
                                .sort((a, b) => entry[b].length - entry[a].length)
                                .map(tag => `**${tag}** members: ${entry[tag].length}`)
                                .join('\n'))
                    ), message);
                } else {
                    return message.channel.send(new RichEmbed()
                        .setColor('ORANGE')
                        .setTitle('This server does not have any registered tags')
                    );
                }
            } else {
                return message.channel.send(new RichEmbed()
                    .setColor('ORANGE')
                    .setTitle('This server does not have any registered tags')
                );
            }
        });
    }
};
