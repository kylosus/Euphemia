const ud						= require('urban-dictionary');
const udIcon					= 'https://cdn.discordapp.com/attachments/352865308203024395/479997284117905440/ud.png';

const {MessageEmbed} = require('discord.js');

const {ArgConsts, ECommand, EmbedLimits} = require('../../lib');
const {CircularList, PaginatedMessage} = require('../../modules');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['urban', 'ud'],
			description: {
				content: 'Looks up Urban Dictionary definitions',
				usage: '[prompt]',
				examples: ['ud malding']
			},
			args: [
				{
					id: 'text',
					type: ArgConsts.TEXT,
					message: 'Please provide text to look up.'
				}
			],
			guildOnly: false,
			nsfw: false,
			ownerOnly: false
		});
	}

	async run(message, args) {
		try {
			return await ud.define(args.text);
		} catch (err) {
			throw `Could not find any definitions for ${args.text}`;
		}
	}

	async ship(message, result) {
		return PaginatedMessage.register(message, s => {
			return new MessageEmbed()
				.setColor('GREEN')
				.setAuthor(s.word, udIcon)
				.setDescription(s.definition);
		}, new CircularList(result));
	}
};
