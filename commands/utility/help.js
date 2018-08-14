const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'utility',
            memberName: 'help',
            description: 'Lists available commands commands',
            examples: [`${client.commandPrefix}help`, `${client.commandPrefix}help ping`]
        });
    }

   async run(message) {
       let args = message.content.split(' ');
       if (args.length === 1) {
           return message.channel.send(new RichEmbed()
                .setTitle(`${message.client.user.tag} commands`)
                .setThumbnail(message.client.user.avatarURL || message.client.user.defaultAvatarURL)
                .setColor(message.client.defaultColor)
                .setDescription(`To run a command in ${message.guild ? message.guild.name : 'any server'},
                use ${Command.usage('command', message.guild ? message.guild.commandPrefix : null, this.client.user)}.
                For example, ${Command.usage('ping', message.guild ? message.guild.commandPrefix : null, this.client.user)}.`)
                .addField('Available commands', message.client.registry.commands.map(command => `**${message.client.commandPrefix}${command.name}**`).join('\n'), false)
            );
       } else {
           const result = message.client.registry.commands.get(args[1]);
           if (!result) {
                return message.channel.send(new RichEmbed()
                    .setColor('RED')
                    .setTitle('Command not found')
                );
           } else {
                const embed = new RichEmbed()
                embed.setTitle(`Command name: ${result.name}`);
                embed.setThumbnail(message.client.user.avatarURL || message.client.user.defaultAvatarURL);
                embed.setColor(message.client.defaultColor);
                embed.setDescription(result.description);
                if (result.aliases.length > 0) {
                    embed.addField('Aliases', result.aliases.join('\n'), false)
                }
                if (result.examples) {
                    embed.addField('Examples', '```' + result.examples.join('\n') + '```', false);
                }
                return message.channel.send(embed);
           }
       }
    }
}