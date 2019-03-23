const udIcon = 'https://cdn.discordapp.com/attachments/352865308203024395/479997284117905440/ud.png'
const { Command }				= require('discord.js-commando');
const { RichEmbed }				= require('discord.js');
const EuphemiaPaginatedMessage	= require('../../util/EuphemiaPaginatedMessage.js');
const ud						= require('urban-dictionary');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            group: 'utility',
            memberName: 'urban',
            description: 'Returns Urban Dictionary definitions',
            aliases: ['ud'],
            nsfw: true
        });
    }

   async run(message) {
       const args = message.content.split(' ');
       if (args.length === 1) {
           return message.channel.send(new RichEmbed()
                .setTitle('Please enter search terms')
                .setColor('ORANGE')
            );
       } else {
    }
			const query = args.join(' ');
			const result = await ud.term(query);

			if (!result) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle(`Could not find definitions for ${query}`)
				);
			}

			EuphemiaPaginatedMessage(result.entries
				.map(entry =>
					new RichEmbed()
						.setColor('GREEN')
						.setAuthor(entry.word, udIcon)
						.setDescription(entry.definition)
				), message
			);
};
