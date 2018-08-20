const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const EuphemiaPaginatedMessage = require('../../util/EuphemiaPaginatedMessage.js');
const ud = require('urban-dictionary');
const udIcon = 'https://cdn.discordapp.com/attachments/352865308203024395/479997284117905440/ud.png'

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            group: 'utility',
            memberName: 'urban',
            description: 'Returns Urban Dictionary definitions',
            aliases: ['ud']
        });
    }

   async run(message) {
       let args = message.content.split(' ');
       if (args.length === 1) {
           return message.channel.send(new RichEmbed()
                .setTitle('Please enter search terms')
                .setColor('ORANGE')
            );
       } else {
            ud.term(args.splice(1).join(' ')).then((result) => {
                EuphemiaPaginatedMessage(result.entries.map(entry => 
                    new RichEmbed()
                        .setColor('GREEN')
                        .setAuthor(entry.word, udIcon)
                        .setDescription(entry.definition)
                ), message);
            }).catch((error) => {
                return message.channel.send(new RichEmbed()
                    .setColor('RED')
                    .addField('Error', error.message)
                );
            })
        }
    }
};