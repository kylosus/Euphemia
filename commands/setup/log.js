const { MessageEmbed, Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

const path			= require('path');
const fs			= require('fs');
const directoryPath	= path.join(__dirname + '/../../events/loggable');


const events = fs.readdirSync(directoryPath, { withFileTypes: true })
	.filter(dirent => dirent.isFile() && !dirent.name.startsWith('_'))
	.map(dirent => dirent.name.replace(/\.[^/.]+$/, ''));

// fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
// 	if (err) {
// 		throw `Unable to scan directory:\n${err}`;
// 	}
//
// 	events = files
// 		.filter(dirent => dirent.isFile() && !dirent.name.startsWith('_'))
// 		.map(dirent => dirent.name.replace(/\.[^/.]+$/, ''));
// });

const SETTINGS = events.reduce(function(acc, curr) {
	acc[curr] = null;
	return acc;
}, {});

module.exports =  class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['log'],
			description: {
				content: 'Handles loggable server events',
				usage: '',
				examples: [
					'log',
				]
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args: [],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
			rateLimited: false,
			fetchMembers: false,
			cached: false,
		});
	}

	async run(message) {
		return this.client.provider.get(message.guild, 'log', SETTINGS);
		// if (args.length < 1) {
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('RED')
		// 		.setTitle(`See ${message.client.commandPrefix}help log for help`)
		// 	);
		// }
		//
		// if (args[0] === 'list') {
		// 	let entry;
		// 	const body = eventModules.map(element => {
		// 		entry = message.client.provider.get(message.guild, element, false);	// Optimize this reee
		// 		if (entry && entry.log && entry.log !== undefined) {	// Not sure why this check is necessary
		// 			entry = `<#${entry.log}>`;
		// 		} else {
		// 			entry = '*';
		// 		}
		//
		// 		return `**${element}** ${entry}`;
		// 	});
		//
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('GREEN')
		// 		.setTitle('Available log events')
		// 		.setDescription(body.join('\n'))
		// 	);
		// }
		//
		// const channel = message.mentions.channels.first();
		//
		// if (!channel) {
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('RED')
		// 		.setTitle('Please mention a channel')
		// 	);
		// }
		//
		// const eventMatch = args.slice(1).join(' ').match(/[a-z]+|[A-Z]+/);
		//
		// if (!eventMatch) {
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('RED')
		// 		.setTitle('Please mention an event')
		// 	);
		// }
		//
		// const event = eventMatch[0];
		//
		// const entry = message.client.provider.get(message.guild, event, false);
		//
		// if (!entry) {
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('RED')
		// 		.addField('Event not found', `Do ${message.guild.commandPrefix}${this.memberName} list to view a list of available events`)
		// 	);
		// }
		//
		// if (args[0] === 'enable') {
		// 	entry.log = channel.id;		// Not sure what this does
		//
		// 	message.client.provider.set(message.guild, event, entry ||  { log: channel.id });	// Warning: unsafe. Should probably use an enumeration database
		//
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('GREEN')
		// 		.setDescription(`Enabled logging for event ${event} <#${channel}>`)
		// 	);
		// }
		//
		// if (args[1] === 'disable') {
		// 	message.client.provider.remove(message.guild, event);
		//
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('GREEN')
		// 		.setTitle(`Disabled logging for event ${event}`)
		// 	);
		// }
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
