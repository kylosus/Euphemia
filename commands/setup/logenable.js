import { PermissionsBitField } from 'discord.js';
import { ArgConsts, ECommand } from '../../lib/index.js';
import { getSettings }         from './log.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['logenable', 'logen'],
			description:     {
				content:  'Enables log events in channels. Run without the second argument to enable everything',
				usage:    '[channel (or current channel)] [event name]',
				examples: [
					'log list',
					'logenable #channel ',
					'logenable #channel guildBanAdd'
				]
			},
			userPermissions: [PermissionsBitField.Flags.ManageGuild],
			args:            [
				{
					id:          'channel',
					type:        ArgConsts.TYPE.CHANNEL,
					optional:    true,
					defaultFunc: m => m.channel
				},
				{
					id:          'event',
					type:        ArgConsts.TYPE.TEXT,
					optional:    true,
					defaultFunc: () => null
				},
			],
			guildOnly:       true,
			ownerOnly:       false,
		});
	}

	async run(message, { channel, event }) {
		const entry = getSettings(message.guild);

		// Single event
		if (event) {
			if (!Object.hasOwnProperty.call(entry, event)) {
				throw `Event ${event} not found`;
			}

			entry[event] = channel.id;

			await this.client.provider.set(message.guild, 'log', entry);
			return `Enabled ${event} in ${channel.toString()}`;
		}

		// All events
		Object.entries(entry).forEach(([key]) => {
			entry[key] = channel.id;
		});

		await this.client.provider.set(message.guild, 'log', entry);

		return `Enabled all events in ${channel.toString()}`;
	}
}
