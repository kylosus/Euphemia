/* soontm
const { RichEmbed } = require('discord.js');

module.exports = (message, reason) => {

    switch(reason) {
        case 'guildOnly': {
            return sendWarning(message, 'This command is guild only.');
        }
        case 'nsfw': {
            return sendWarning(message, 'This command cannot be used in non-nsfw channels.');
        }
        case 'permission': {
            return sendWarning(message, `This command requires ${message.command.userPermissions} permission.`);
        }
        case 'throttling': {
            return message.channel.send(`${message.author.toString()}, you can use the command again in ${message.command._throttles} seconds`).then(warningMessage => {
                setTimeout((message, warningMessage) => { message.delete(); warningMessage.delete() }, 2000);
            });
        }
    }
}


function sendWarning(message, body) {
    return message.channel.send(message.author.toString(), new RichEmbed()
        .setColor(16777215)
        .addField('Command execution was blocked', body)
    );
}

*/