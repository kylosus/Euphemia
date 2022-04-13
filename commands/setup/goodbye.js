import { MessageEmbed, Permissions } from 'discord.js';
import { ArgConsts, ECommand }       from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['goodbye'],
			description:     {
				content:  'Sets up goodbye channel and message. Send without arguments to disable it',
				usage:    [
					'%MENTION       -> mentions user',
					'%NAME%         -> user tag',
					'$MEMBER_COUNT$ -> guild member count',
					'$AVATAR$       -> avatar URL'
				].join('\n'),
				examples: [
					'welcome',
					'welcome #general',
					'welcome {\n\t"content":"%MENTION% has left.",\n\t"image":"https://image-link.com"\n}'
				]
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args:            [
				{
					id:       'message',
					type:     ArgConsts.TYPE.JSON,
					optional: true,
					default:  () => null
				},
				{
					id:       'channel',
					type:     ArgConsts.TYPE.CHANNEL,
					optional: true,
					default:  () => null
				},
			],
			guildOnly:       true,
			ownerOnly:       false,
		});
	}

	async run(message, args) {
		const entry = this.client.provider.get(message.guild, 'goodbye',
			{ channel: null, message: { content: null, embed: null } });

		if (!args.channel && !args.message) {
			entry.channel = null;
			await this.client.provider.set(message.guild, 'goodbye', entry);
			return 'Disabled goodbye message';
		}

		if (args.channel) {
			entry.channel = args.channel.id;
			await this.client.provider.set(message.guild, 'goodbye', entry);
		}

		if (!args.message) {
			return `Moved goodbye message to ${args.channel.toString()}`;
		}

		// Parse the json
		const json = JSON.parse(args.message);

		// Extract the content and save the rest for the embed
		entry.message.content = json.content;
		delete json.content;

		// If json is not empty save it and try sending it
		if (Object.keys(json).length) {
			await message.channel.send({ content: entry.message.content, embeds: [new MessageEmbed(json)] });
			entry.message.embed = JSON.stringify(json);
		} else {
			// is there a point?
			entry.message.embed = null;
			await message.channel.send({ content: entry.message.content });
		}

		await this.client.provider.set(message.guild, 'goodbye', entry);

		if (!entry.channel) {
			return 'Enabled goodbye message. ' + '\n' +
				'Warning, goodbye channel not set. Run `goodbye #channel`';
		}

		const channel = message.guild.channels.cache.get(entry.channel);

		if (channel) {
			return `Enabled goodbye message in ${channel}`;
		}

		return `Enabled goodbye message, but channel ${entry.channel} seems to have been deleted`;
	}

	async ship(message, result) {
		return message.channel.send({
			embeds: [new MessageEmbed()
				.setColor('GREEN')
				.setDescription(result)]
		});
	}
}
