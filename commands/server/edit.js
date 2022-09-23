import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ArgConsts, ArgumentType, ECommand } from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['edit', 'editmessage'],
			description:     {
				content:  'Edits messages. Supports embeds',
				usage:    '<message url or reply> <text>',
				examples: ['edit https://discord.com/channels/292277485310312448/292277485310312448/850097454262386738 {JSON}']
			},
			userPermissions: [PermissionsBitField.Flags.Administrator],
			args:            [
				{
					id:          'url',
					type:        new ArgumentType(
						/https:\/\/(\w+\.)?discord\.com\/channels\/\d+\/\d+\/\d+/,
						ArgConsts.flatten,
						(_, u) => {
							const ids = u.match(/\d+/g);

							if (ids.length !== 3) {
								throw 'Bad message url';
							}

							return {
								guildID:   ids[0],
								channelID: ids[1],
								messageID: ids[2]
							};
						}
					),
					message:     'Please provide message url',
					optional:    true,
					defaultFunc: m => m.reference ||
						m.channel.messages.cache.find(i => i.author.id === this.client.user.id) ||
						(() => {
							throw 'Please link to a message';
						})()
				},
				{
					id:      'text',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please provide text'
				}
			],
			guildOnly:       false,
			ownerOnly:       true,
		});
	}

	async run(message, { url, text }) {
		const { guildID, channelID, messageID } = url;

		if (guildID !== message.guild.id) {
			throw 'Please link to a message in this server';
		}

		const channel = message.guild.channels.cache.get(channelID) || (() => {
			throw 'Channel not found';
		})();

		const toEdit = await channel.messages.fetch({ message: messageID });

		if (toEdit.author.id !== toEdit.guild.members.me.id) {
			throw 'Cannot edit messages of other users';
		}

		try {
			const json = JSON.parse(text);
			await toEdit.edit({ content: json.content, embeds: [new EmbedBuilder(json)] });
		} catch (err) {
			await toEdit.edit({ content: text });
		}

		return 'Edited message';
	}
}
