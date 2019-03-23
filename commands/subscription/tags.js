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
    }
		const entry = await collection.findOne({_id: message.guild.id}, {projection: {_id: 0}});

		if (!entry) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('This server does not have any registered tags')
			);
		}

		const tags = Object.keys(entry);

		if (!tags.length) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('This server does not have any registered tags')
			);
		}
};
