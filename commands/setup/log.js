const {MessageEmbed, Permissions}	= require('discord.js');
const {ECommand}					= require('../../lib');
const path							= require('path');
const fs							= require('fs');
const directoryPath					= path.join(__dirname, '/../../events/loggable');

const events = fs.readdirSync(directoryPath, {withFileTypes: true})
	// .filter(dirent => dirent.isFile() && !dirent.name.startsWith('_'))
	.map(dirent => dirent.name.replace(/\.[^.]+$/, '').replace('_', ''));

const SETTINGS = events.reduce(function (acc, curr) {
	acc[curr] = null;
	return acc;
}, {});

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['log'],
			description: {
				content:	'Handles loggable server events',
				usage:		'',
				examples:	['log']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			guildOnly: true,
			ownerOnly: false,
		});
	}

	async run(message) {
		return this.client.provider.get(message.guild, 'log', SETTINGS);
	}

	async ship(message, result) {
		const embed = new MessageEmbed()
			.setTitle('Available log events')
			.setColor('GREEN');

		const body = Object.entries(result)
			.map(([key, value]) => {
				if (value) {
					return `**${key}** <#${value}>`;
				}

				return `**${key}** *No channel*`;
			})
			.join('\n');

		embed.setDescription('__Use logenable to unlock__' + '\n\n' + body);

		return message.channel.send(embed);
	}
};

module.exports.getSettings = () => SETTINGS;
