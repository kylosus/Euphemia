const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const EuphemiaEmbed = require('../../util/EuphemiaEmbed.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'welcome',
            group: 'setup',
            memberName: 'welcome',
            description: 'Sets up welcome message.',
            details: 'Takes a JSON String as an argument.\n`%MENTION%` -> mentions user;\n`%NAME%` -> user name and discriminator without tagging;\n$MEMBER_COUNT$ -> guild member count;\n$AVATAR$ -> avatar URL',
            examples: [`JSON\n${client.commandPrefix}welcome {\n\t"content":"%MENTION% has joined the server",\n\t"image":"http://image-link.com"\n}`],
            userPermissions: ['MANAGE_GUILD'],
            guildOnly: true
        });
    }

   async run(message) {
       if (!message.content.includes(' ')) {
           this.client.provider.remove(message.guild, 'guildMemberAdd').then(oldValue => {
               if (oldValue) {
                    return message.embed(new RichEmbed()
                        .setColor('RED')
                        .setTitle('Removed and disabled welcome message for this guild')
                    );
               } else {
                    return message.embed(new RichEmbed()
                        .setColor('RED')
                        .setTitle('Please specify a welcome message, or channel')
                    );
               }
           })
        } else {
            const argument = message.content.split(' ').splice(1).join(' ');
            if (argument.startsWith('<#')) {
                const object = this.client.provider.get(message.guild, 'guildMemberAdd', false);
                if (object) {
                    object.channel = message.mentions.channels.array()[0].id;
                    this.client.provider.set(message.guild, 'guildMemberAdd', object);
                    return message.embed(new RichEmbed()
                        .setColor('GREEN')
                        .setTitle(`Welcome channel set to #${message.guild.channels.find(val => val.id === object.channel).name}`));
                } else {
                    this.client.provider.set(message.guild, 'guildMemberAdd', { message: null, channel: message.mentions.channels.array()[0].id }).then(entry =>{
                        message.embed(new RichEmbed()
                            .setColor('GREEN')
                            .setTitle(`Welcome channel set to #${message.mentions.channels.array()[0].name}`));
                        return message.embed(new RichEmbed()
                            .setColor('ORANGE')
                            .setTitle(`Warning: No Welcome message set. Do ${this.client.commandPrefix}welcome {JSON} to set the channel`)
                        );
                    });
                }
            } else if (argument.startsWith('{')) {
                const entry = this.client.provider.get(message.guild, 'guildMemberAdd', false);
                if (entry) {
                    if (!entry.channel) {
                        message.embed(new RichEmbed()
                            .setColor('ORANGE')
                            .setTitle(`Warning: No Welcome channel set. Do ${this.client.commandPrefix}welcome #channel to set the channel`)
                        );
                    }
                    const embed = EuphemiaEmbed.build(argument);
                    if (embed) {
                        entry.message = argument;
                        this.client.provider.set(message.guild, 'guildMemberAdd', entry);
                        message.channel.send(new RichEmbed()
                            .setColor('GREEN')
                            .setTitle('Welcome message set')
                        );
                        return message.channel.send([embed.content], embed);
                    } else {
                        return message.channel.send(new RichEmbed()
                            .setColor('RED')
                            .setTitle('Please check your input')
                        );
                    }
                } else {
                    const embed = EuphemiaEmbed.build(argument);
                    if (embed) {
                        this.client.provider.set(message.guild, 'guildMemberAdd', {message: argument, channel: null})
                        message.channel.send(new RichEmbed()
                            .setColor('GREEN')
                            .setTitle('Welcome message set')
                        );
                        return message.channel.send([embed.content], embed);
                    } else {
                        return message.channel.send(new RichEmbed()
                            .setColor('RED')
                            .setTitle('Please check your input')
                        );
                    }
                }
            } else {
                return message.embed(new RichEmbed()
                    .setColor('ORANGE')
                    .setTitle(`See ${this.client.commandPrefix}help welcome for help`)
                );
            }
        }
    }
}