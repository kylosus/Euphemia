const { MessageEmbed, Permissions } = require('discord.js');
const { ECommand }                  = require('../../lib');
const path                          = require('path');
const fs                            = require('fs');
const directoryPath                 = path.join(__dirname, '/../../events/loggable');

const events = fs.readdirSync(directoryPath, { withFileTypes: true })
	.map(dirent => dirent.name.replace(/\.[^.]+$/, '').replace('_', ''));

const SETTINGS = events.reduce(function (acc, curr) {
	acc[curr] = null;
	return acc;
}, {});

const getSettings = guild => {
	const settings = guild.provider.get('log', {});
	return { ...SETTINGS, ...settings };
};

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['log'],
			description:     {
				content:  'Handles loggable server events',
				usage:    '',
				examples: ['log']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			guildOnly:       true,
			ownerOnly:       false,
		});
	}

	async run(message) {
		return getSettings(message.guild);
	}

	async ship(message, result) {
		const embed = new MessageEmbed().setTitle('Available log events').setColor('GREEN');

		const body = Object.entries(result).map(([key, value]) => {
			if (value) {
				return `**${key}** <#${value}>`;
			}

			return `**${key}** *No channel*`;
		}).join('\n');

		embed.setDescription('__Use logenable to unlock__' + '\n\n' + body);

		return message.channel.send(embed);
	}
};

module.exports.getSettings = getSettings;
