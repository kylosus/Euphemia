import { Colors, EmbedBuilder, inlineCode } from 'discord.js';
import { ArgConsts, ECommand }              from '../../lib/index.js';
import { EmbedError }                       from '../../lib/Error/index.js';

export default class extends ECommand {
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
					id:      'id',
					type:    ArgConsts.TYPE.BARE_ID,
					message: 'Please provide a message id.'
				},
				{
					id:          'channel',
					type:        ArgConsts.TYPE.CHANNEL,
					optional:    true,
					defaultFunc: m => m.channel
				}
			],
			guildOnly:   true,
			ownerOnly:   false
		});
	}

	async run(message, { channel, id }) {
		return channel.messages.fetch(String(id)).catch(() => {
			throw new EmbedError(`Message ${channel}/${inlineCode(id)} not found`);
		});
	}

	async ship(message, result) {
		const embed = new EmbedBuilder().setColor(result.member?.displayColor ?? Colors.White)
			.addFields({ name: 'Jump to message', value: `[Link](${result.url})` })
			.setDescription(result.content || '*No content*')
			.setFooter({ text: `In #${result.channel.name}` })
			.setTimestamp(result.createdAt);

		if (result.author) {
			embed.setAuthor({
				name:    result.author.username,
				iconURL: result.author.displayAvatarURL()
			});
		} else {
			embed.setAuthor({ name: 'Unknown [deleted] user' });
		}

		const attachment = result.attachments.first();

		if (attachment && /\.(gif|jpg|jpeg|tiff|png|webm|webp)$/i.test(attachment.url)) {
			embed.setImage(attachment.proxyURL);
		}

		return message.reply({ embeds: [embed] });
	}
}
