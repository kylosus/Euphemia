const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            group: 'utility',
            memberName: 'quote',
            description: 'Quotes a message by given ID',
            examples: [`${client.commandPrefix}quote 12345678`],
            guildOnly: true
        });
    }

   async run(message) {
       const args = message.content.split(' ');
       if (args.length < 2) {
           return message.channel.send(new RichEmbed()
                .setColor('RED')
                .setTitle('Please enter a message ID')
            );
       } else {
       }
   }
}
			);
		} else {
			const found = await message.channel.fetchMessage(args[1]);

			if (!found) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle('Message not found')
				);
			}

