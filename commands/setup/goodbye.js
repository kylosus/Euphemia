const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'goodbye',
            group: 'setup',
            memberName: 'goodbye',
            description: 'Sets up goodbye message. Takes a JSON String as an argument.\n`%MENTION%` -> mentions user;\n`%NAME%` -> user name and discriminator without tagging;\n$MEMBER_COUNT$ -> guild member count;\n$AVATAR$ -> avatar URL',
            examples: [`\`\`\`JSON\n${client.commandPrefix}goodbye {\n\t"content":"%MENTION% has joined the server",\n\t"image":"http://image-link.com"\n}\`\`\``],
            userPermissions: ['MANAGE_GUILD']
        });
    }

   async run(message) {
       if (!message.content.includes(' ')) {
           message.client.provider.remove(message.guild, 'guildMemberRemove').then(oldValue => {
               if (oldValue) {
                    return message.embed(new RichEmbed()
                        .setColor('RED')
                        .setTitle('Removed and disabled goodbye message for this guild')
                    );
               } else {
                    return message.embed(new RichEmbed()
                        .setColor('RED')
                        .setTitle('Please specify a goodbye message, or channel')
                    );
               }
           })
        } else {
            let argument = message.content.split(`${message.client.commandPrefix}goodbye `)[1];
            if (argument.startsWith('<#')) {
                let object = message.client.provider.get(message.guild, 'guildMemberRemove', false);
                if (object) {
                    object.channel = message.mentions.channels.array()[0].id;
                    message.client.provider.set(message.guild, 'guildMemberRemove', object);
                    return message.embed(new RichEmbed()
                        .setColor('GREEN')
                        .setTitle(`Goodbye channel set to #${message.guild.channels.find(val => val.id === object.channel).name}`));
                } else {
                    message.client.provider.set(message.guild, 'guildMemberRemove', { message: null, channel: message.mentions.channels.array()[0].id }).then(entry =>{
                        message.embed(new RichEmbed()
                            .setColor('GREEN')
                            .setTitle(`Goodbye channel set to #${message.mentions.channels.array()[0].name}`));
                        return message.embed(new RichEmbed()
                            .setColor('ORANGE')
                            .setTitle(`Warning: No Goodbye message set. Do ${message.client.commandPrefix}goodbye {JSON} to set the channel`)
                        );
                    });
                }
            } else if (argument.startsWith('{')) {
                let entry = message.client.provider.get(message.guild, 'guildMemberRemove', false);
                if (entry) {
                    entry.message = argument;
                    let newEntry = message.client.provider.set(message.guild, 'guildMemberRemove', entry);
                    if (!entry.channel) {
                        message.embed(new RichEmbed()
                            .setColor('ORANGE')
                            .setTitle(`Warning: No Goodbye channel set. Do ${message.client.commandPrefix}goodbye #channel to set the channel`)
                        );
                    }
                    return message.embed(new RichEmbed()
                        .setColor('GREEN')
                        .setTitle('Goodbye message set')).then(message => {
                            message.channel.send(JSON.parse(argument).content || '', new RichEmbed(JSON.parse(argument)));
                        });
                } else {
                    message.client.provider.set(message.guild, 'guildMemberRemove', {message: argument, channel: null}).then(entry => {
                        return message.embed(new RichEmbed()
                            .setColor('GREEN')
                            .setTitle('Goodbye message set')).then(message => {
                                message.channel.send(JSON.parse(argument).content || '', new RichEmbed(JSON.parse(argument)));
                            });
                        })
                    }
            } else {
                return message.embed(new RichEmbed()
                    .setColor('ORANGE')
                    .setTitle(`See ${message.client.commandPrefix}help goodbye for help`)
                )
            }
        }
    }
}