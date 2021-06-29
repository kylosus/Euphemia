const { ErrorEmbed } = require('../util/DefaultResponse');
const { Command } = require('discord.js-commando');
const { Permissions } = require('discord.js');

module.exports = class ECommand extends Command {
	constructor(client, info) {
		super(client, info);
	}

	onBlock({ channel }, reason, data) {
		switch (reason) {
			case 'guildOnly':	return channel.send(ErrorEmbed('You must be in a server to use this command'));
			case 'nsfw':		return channel.send(ErrorEmbed(`The \`${this.name}\` command can only be used in NSFW channels.`));

			case 'permission': {
				if (data.response) return channel.send(data.response);
				return channel.send(ErrorEmbed(`You do not have permission to use the \`${this.name}\` command.`));
			}

			case 'clientPermissions': {
				if (data.missing.length === 1) {
					return channel.send(ErrorEmbed(
						`I need the "${Permissions[data.missing[0]]}" permission for the \`${this.name}\` command to work.`
					));
				}

				return channel.send(ErrorEmbed(`
					I need the following permissions for the \`${this.name}\` command to work:
					${data.missing.map(perm => Permissions[perm]).join(', ')}
				`));
			}

			case 'throttling': {
				return channel.send(ErrorEmbed(`You may not use this command again for another
										${data.remaining.toFixed(1)} seconds`
				));
			}

			default:
				return null;
		}
	}


};
