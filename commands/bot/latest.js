const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const changelog = require('./changelog.json');
const packageJSON = require('../../package.json');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'latest',
            group: 'bot',
            memberName: 'latest',
            description: 'Shows latest bot changes.',
            examples: [`${client.commandPrefix}latest`, `${client.commandPrefix}latest list`, `${client.commandPrefix}latest 2.0.0`]
        });
    }

   async run(message) {
       const args = message.content.split(' ');
       if (args.length === 1) {
           return message.channel.send(build(changelog[0]));
       } else if (args[1] === 'list') {
            return message.channel.send(new RichEmbed()
                .setColor(global.BOT_DEFAULT_COLOR)
                .addField('Available versions', changelog.map(log => `**${log.version}** ${log.note}`))
            );
       } else {
           const log = changelog.find(log => log.version === args[1]);
           if (log) {
               return message.channel.send(build(log));
           } else {
                return message.channel.send(new RichEmbed()
                    .setColor('ORANGE')
                    .addField(`Version ${log} not found`, `try ${this.client.commandPrefix}${this.name} list to view available versions`)
                );
           }
       }
    }
}

function build(log) {
    return new RichEmbed()
        .setTitle(`Euphemia version ${log.version} by ${packageJSON.author}`)
        .setURL('https://github.com/jokersus/Euphemia')
        .setThumbnail('https://cdn.discordapp.com/attachments/469111529384443904/473072301315981312/Euphie-sama.png')
        .setColor([233, 91, 169])
        .addField('Major changes', log.major.map(x => `• ${x}`).join('\n'))
        .addField('Minor changes', log.minor.map(x => `• ${x}`).join('\n'))
}