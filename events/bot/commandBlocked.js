const { RichEmbed }		= require('discord.js');
// const WARNING_COLOR		= 167772;
// const DELETE_TIMEOUT	= 2000;

module.exports = async (message, reason, data) => {
	switch(reason) {
		case 'guildOnly': {
			return _sendWarning(message.channel, 'This command can only be used in guilds.');
		}

		case 'nsfw': {
			return _sendWarning(message.channel, 'This command can only be used in NSFW channels.');
		}

		case 'permission': {
			return _sendWarning(message.channel, `This command requires ${message.command.userPermissions} permission.`);
		}

		case 'throttling': {
			const warning = await message.channel.send(`${message.author.toString()}, you are exceeding the maximum command usage timeout\nPlease wait ${data.throttle} seconds`);
			return setTimeout((message, warning) => message.channel.bulkDelete([message, warning]), 2000, message, warning);
		}

		case 'clientPermissions': {
			return _sendWarning(message.channel,
				`I lack the following permission to execute the ${message.command.name} command\n` +
				'```' + data.clientPermissions.join('\n') + '```'
			);
		}
	}
};

function _sendWarning(channel, body) {
	return channel.send(new RichEmbed()
		.setColor(16777215)
		.addField('Command execution was blocked', body)
	);
}
