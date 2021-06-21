const { MessageEmbed } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['quote'],
			description: {
				content: 'Quotes a message',
				usage: '<id> [#channel]',
				examples: ['quote id', 'quote id #channel', 'quote #channel id']
			},
			args: [
				{
					id: 'channel',
					type: ArgConsts.CHANNEL,
					optional: true,
					default: m => m.channel
				},
				{
					id: 'id',
					type: ArgConsts.TEXT,
					message: 'Please provide a message id.'
				}
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false
		});
	}

	async run(message, args) {
		return await args.channel.messages.fetch(args.id);
	}

	async ship(message, result) {
		const embed = new MessageEmbed()
			.setColor(result.member ? result.member.displayColor : 'WHITE')
			.addField('Jump to message', '[Link](https://google.com)')
			.setDescription(result.content || '*No content*')
			.setFooter(`In #${result.channel.name}`)
			.setTimestamp(result.createdAt);

		if (result.author) {
			embed.setAuthor(result.author.username, result.author.displayAvatarURL(), null);
		} else {
			embed.setAuthor('Unknown [deleted] user', null, null);
		}

		const attachment = result.attachments.first();

		if (attachment && /\.(gif|jpg|jpeg|tiff|png|webm|webp)$/i.test(attachment.url)) {
			embed.setImage(attachment.url);
		}

		return message.channel.send(embed);
	}
};
