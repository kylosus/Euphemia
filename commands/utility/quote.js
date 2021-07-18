const { MessageEmbed }        = require('discord.js');
const { ArgConsts, ECommand } = require('../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['quote'],
			description: {
				content:  'Quotes a message',
				usage:    '<id> [#channel]',
				examples: ['quote id', 'quote id #channel', 'quote #channel id']
			},
			args:        [
				{
					id:       'channel',
					type:     ArgConsts.CHANNEL,
					optional: true,
					default:  m => m.channel
				},
				{
					id:      'id',
					type:    ArgConsts.TEXT,
					message: 'Please provide a message id.'
				}
			],
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message, { channel, id }) {
		return channel.messages.fetch(id);
	}

	async ship(message, result) {
		const embed = new MessageEmbed().setColor(result.member ? result.member.displayColor : 'WHITE')
			.addField('Jump to message', `[Link](${result.url})`)
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
			embed.setImage(attachment.proxyURL);
		}

		return message.channel.send(embed);
	}
};
