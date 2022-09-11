import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ECommand }                          from '../../lib/index.js';
import { readdirSync }                       from 'fs';
import { URL }                               from 'url';

const directoryPath = new URL('../../events/loggable', import.meta.url);

const events = readdirSync(directoryPath, { withFileTypes: true })
	.map(dirent => dirent.name.replace(/\.[^.]+$/, '').replace('_', ''));

const SETTINGS = events.reduce(function (acc, curr) {
	acc[curr] = null;
	return acc;
}, {});

export const getSettings = guild => {
	const settings = guild.provider.get('log', {});
	return { ...SETTINGS, ...settings };
};

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:                 ['log'],
			description:             {
				content:  'Handles loggable server events',
				usage:    '',
				examples: ['log']
			},
			userPermissions: [PermissionsBitField.Flags.ManageGuild],
			guildOnly:               true,
			ownerOnly:               false,
		});
	}

	async run(message) {
		return getSettings(message.guild);
	}

	async ship(message, result) {
		const embed = new EmbedBuilder().setTitle('Available log events').setColor(this.client.config.COLOR_OK);

		const body = Object.entries(result).map(([key, value]) => {
			if (value) {
				return `**${key}** <#${value}>`;
			}

			return `**${key}** *No channel*`;
		}).join('\n');

		embed.setDescription('__Use logenable to unlock__' + '\n\n' + body);

		return message.channel.send({ embeds: [embed] });
	}
}
