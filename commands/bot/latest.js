const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');
const changelog		= require('./changelog.json');
const pjson			= require('../../package.json');
const THUMBNAIL		= 'https://cdn.discordapp.com/attachments/469111529384443904/473072301315981312/Euphie-sama.png';

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
			return message.channel.send(_build(changelog[0]));
		}

		if (!changelog.length) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('No changelog found')
			);
		}

		if (args[1] === 'list') {
			return message.channel.send(new RichEmbed()
				.setColor(global.BOT_DEFAULT_COLOR)
				.addField('Available versions', changelog.map(log => `**${log.version}** ${log.note}`))
			);
		}

		const log = changelog.find(log => log.version === args[1]);
		if (log) {
			return message.channel.send(_build(log));
		} else {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.addField('Version not found', `try ${this.client.commandPrefix}${this.name} list to view available versions`)
			);
		}
	}
};

function _build(log) {
	return new RichEmbed()
		.setTitle(`${pjson.name} version ${log.version} by ${pjson.author}`)
		.setURL(pjson.repository.url)
		.setThumbnail(THUMBNAIL)
		.setColor(global.BOT_DEFAULT_COLOR)
		.addField('Major changes', log.major.map(x => `• ${x}`).join('\n'))
		.addField('Minor changes', log.minor.map(x => `• ${x}`).join('\n'));
}
