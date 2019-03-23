const { RichEmbed }		= require('discord.js');

module.exports = (message, reason) => {

    switch(reason) {
        case 'guildOnly': {
            return sendWarning(message, 'This command can only be used in guilds.');
        }
        case 'nsfw': {
            return sendWarning(message, 'This command cannot be used in non-NSFW channels.');
        }
        case 'permission': {
            return sendWarning(message, `This command requires ${message.command.userPermissions} permission.`);
        }
        case 'throttling': {
            return message.channel.send(`${message.author.toString()}, you are exceeding the maximum command usage timeout`).then(warningMessage => {
                setTimeout((message, warningMessage) => { message.delete(); warningMessage.delete() }, 2000, message, warningMessage);
            });
        }
    }
};

function sendWarning(message, body) {
    return message.channel.send(message.author.toString(), new RichEmbed()
        .setColor(16777215)
        .addField('Command execution was blocked', body)
    );
};