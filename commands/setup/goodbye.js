const { MessageEmbed, Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['goodbye'],
			description: {
				content: 'Sets up goodbye channel and message. Send without arguments to disable it',
				usage: [
					'%MENTION       -> mentions user',
					'%NAME%         -> user tag',
					'$MEMBER_COUNT$ -> guild member count',
					'$AVATAR$       -> avatar URL'
				].join('\n'),
				examples: [
					'goodbye',
					'goodbye #general',
					'goodbye {\n\t"content":"%MENTION% has left!",\n\t"image":"https://image-link.com"\n}'
				]
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args: [
				{
					id: 'message',
					type: ArgConsts.JSON,
					optional: true,
					default: () => null
				},
				{
					id: 'channel',
					type: ArgConsts.CHANNEL,
					optional: true,
					default: () => null
				},
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
			rateLimited: false,
			fetchMembers: false,
			cached: false,
		});
	}

	async run(message, args) {
		const entry = this.client.provider.get(message.guild, 'goodbye',
			{channel: null, message: {content: null, embed: null}});

		if (!args.channel && !args.message) {
			entry.channel = null;
			await this.client.provider.set(message.guild, 'welcome', entry);
			return 'Disabled goodbye message';
		}

		entry.channel = args.channel.id;
		await this.client.provider.set(message.guild, 'goodbye', entry);

		if (!args.message) {
			return `Moved goodbye message to ${args.channel.toString()}`;
		}

		const json = JSON.parse(args.message);
		const embed = new MessageEmbed(json);

		entry.message.content = json.content;
		entry.message.embed = embed.toJSON();

		if (!entry.channel) {
			await this.sendNotice(message, 'Enabled goodbye message. ' +
				'Warning, goodbye channel not set. Run `goodbye #channel`');
		} else {
			await this.sendNotice(message, `Enabled goodbye message in ${args.channel.toString()}`);
		}

		await this.client.provider.set(message.guild, 'goodbye', entry);

		return entry;
	}

	async ship(message, result) {
		if (typeof result === 'string') {
			return message.channel.send(new MessageEmbed()
				.setColor('GREEN')
				.setDescription(result)
			);
		}

		return message.channel.send(result.message.content, new MessageEmbed(result.message.embed));
	}
};
