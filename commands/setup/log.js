const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const events = event => require(`../events/${event}`);
const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname + '/../../events');
const eventModules = [];
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
        eventModules.push(file.replace(/\.[^/.]+$/, ""));
    });
});

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'log',
            group: 'setup',
            memberName: 'log',
            description: 'Bind log events to channels',
            userPermissions: ['MANAGE_GUILD'],
            examples: [`${client.commandPrefix}log list`, `${client.commandPrefix}log enable event #channel`],
            guildOnly: true
        });
    };

    async run(message) {
        let args = message.content.split(' ');
        if (args.length < 2) {
            return message.embed(new RichEmbed()
                .setColor('ORANGE')
                .setTitle(`See ${message.client.commandPrefix}help log for help`)
            );
        } else {
            if (args[1] === 'list') {
                let entry;
                let body = eventModules.map(element => {
                    entry = message.client.provider.get(message.guild, element, false);
                    if (entry.log && entry.log !== undefined) {
                        entry = `<#${entry.log}>`;
                    } else {
                        entry = '*';
                    }
                    return `**${element}** ${entry}`
                })
                return message.embed(new RichEmbed()
                    .setColor('GREEN')
                    .setTitle('Available log events')
                    .setDescription(body.join('\n'))
                );

             } else if (args[1] === 'enable') {
                if (!checkArgs(message, args)) {
                    return;
                }
                let channel = message.mentions.channels.array()[0].id;
                let entry = message.client.provider.get(message.guild, args[2], false)
                if (entry) {
                    entry.log = channel;
                }
                message.client.provider.set(message.guild, args[2], entry || {log: channel});
                return message.embed(new RichEmbed()
                    .setColor('GREEN')
                    .setDescription(`Enabled logging for event ${args[2]} <#${channel}>`)
                );

            } else if (args[1] === 'disable') {
                if (!checkArgs(message, args)) {
                    return;
                }
                let entry = message.client.provider.get(message.guild, args[2], false)
                if (!entry) {
                    return sendInvalidEntryWarning(message, `Event ${args[2]} is not logged`);
                }
                entry.log = null;
                message.client.provider.set(message.guild, args[2], entry);
                return message.embed(new RichEmbed()
                    .setColor('GREEN')
                    .setTitle(`Disabled logging for event ${args[2]}`)
                );
            } else {
                checkArgs(message, args);
            }
        }
    }
}

function checkArgs(message, args) {
    if (!(message.mentions.channels.array().length > 0) && args[1] === 'enable') {   
        sendInvalidEntryWarning(message, `Please enter a channel. See ${message.client.commandPrefix}help log for help`);
        return false;
    }
    if (!eventModules.includes(args[2])) {
        sendInvalidEntryWarning(message, `Please enter a valid event. See ${message.client.commandPrefix}help log for help`);
        return false;
    }
    return true;
}

function sendInvalidEntryWarning(message, warning) {
    return message.embed(new RichEmbed()
        .setColor('ORANGE')
        .setTitle(warning)
    );
}