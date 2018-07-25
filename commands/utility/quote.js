const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

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
       let args = message.content.split(' ');
       if (args.length < 2) {
           return message.embed(new RichEmbed()
                .setColor('RED')
                .setTitle('PLease enter a message ID')
            );
       } else {
           message.channel.fetchMessage(args[1]).then(found => {
               let embed = new RichEmbed()                   
                                    .setColor(found.member.displayColor)
                                    .setAuthor(found.author.username, found.author.avatarURL, null)
                                    .setDescription(found.content)
                                    .setFooter(`In #${found.channel.name}`)
                                    .setTimestamp(found.createdAt);
                if (found.embeds.length >= 1) {
                    if (found.embeds[0].image) {
                        embed.setImage(found.embeds[0].image.url);
                    }
                }

                let attachments = found.attachments.array();
                if (attachments.length > 1) {
                    let attachmentFieldBody = [];
                    attachments.forEach(attachment => {
                        attachmentFieldBody.push(attachment.url);
                    });
                    embed.addField('Attachments', attachmentFieldBody.join('\n'));
                } else if (attachments.length === 1) {
                    if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(attachments[0].url)) {
                        embed.setImage(attachments[0].url);
                    }
                }
                message.embed(embed);
           }).catch(() => {
               return message.embed(new RichEmbed()
                    .setColor('RED')
                    .setTitle('Message not found')
                );
           })
       }
   }
}