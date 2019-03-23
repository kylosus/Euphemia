const { RichEmbed }		= require('discord.js');

module.exports = (message, reason) => {
			return _sendWarning(message.channel, 'This command can only be used in guilds.');

    switch(reason) {
        case 'guildOnly': {
        }
        case 'nsfw': {
        }
        case 'permission': {
        }
        case 'throttling': {
            return message.channel.send(`${message.author.toString()}, you are exceeding the maximum command usage timeout`).then(warningMessage => {
                setTimeout((message, warningMessage) => { message.delete(); warningMessage.delete() }, 2000, message, warningMessage);
            });
        }
    }
			return _sendWarning(message.channel, 'This command can only be used in NSFW channels.');
			return _sendWarning(message.channel, `This command requires ${message.command.userPermissions} permission.`);
			return _sendWarning(message.channel,
};

    return message.channel.send(message.author.toString(), new RichEmbed()
        .setColor(16777215)
        .addField('Command execution was blocked', body)
    );
function _sendWarning(channel, body) {
