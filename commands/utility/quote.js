const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            group: 'utility',
            memberName: 'quote',
            description: 'Quotes a message by given ID',
            examples: [`${client.commandPrefix}quote 329904853604368385`],
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
            try {
                const found = await message.channel.fetchMessage(args[1]);

                if (!found) {
                    return message.channel.send(new RichEmbed()
                        .setColor('RED')
                        .setTitle('Message not found')
                    );
                }

                console.log(found)
                const embed = new RichEmbed()
                    .setColor(found.member.displayColor || 0xffffff)
                    .setDescription(found.content || '*No content*')
                    .setFooter(`In #${found.channel.name}`)
                    .setTimestamp(found.createdAt);

                if (found.author) {
                    embed.setAuthor(found.author.username, found.author.avatarURL || found.author.defaultAvatarURL, null);
                } else {
                    embed.setAuthor('Unknown [deleted] user', null, null);
                }

                if (found.embeds.length >= 1) {
                    if (found.embeds[0].image) {
                        embed.setImage(found.embeds[0].image.url);
                    }
                }

                if (found.attachments.size > 1) {
                    const attachmentFieldBody = found.attachments.map(attachment => attachment.url);

                    embed.addField('Attachments', attachmentFieldBody.join('\n'));
                } else if (found.attachments.size === 1) {
                    const attachment = found.attachments.first();
                    if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(attachment.url)) {
                        embed.setImage(attachment.url);
                    }
                }

                message.channel.send(embed).catch(err => { });
            } catch (err) {
                if (err.message === 'Unknown Message') {
                    message.channel.send(new RichEmbed()
                        .setColor('RED')
                        .setTitle('Message not found')
                    );
                    return;
                }
                throw err;
            }
        }
    }
};
