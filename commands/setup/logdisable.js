import { PermissionsBitField } from 'discord.js';
import { ArgConsts, ECommand } from '../../lib/index.js';
import { getSettings }         from './log.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['logdisable', 'logdis'],
			description:     {
				content:  'Disables log events in channels. Run without the second argument to disable everything',
				usage:    '[channel (or current channel)] [event name]',
				examples: [
					'log list',
					'logdisable #channel ',
					'logdisable #channel guildBanAdd'
				]
			},
			userPermissions: [PermissionsBitField.Flags.ManageGuild],
			args:            [
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

	async run(message, { event }) {
		const entry = getSettings(message.guild);

		// Single event
		if (event) {
			if (!Object.hasOwnProperty.call(entry, event)) {
				throw `Event ${event} not found`;
			}

			entry[event] = null;

			await this.client.provider.set(message.guild, 'log', entry);
			return `Disabled ${event}`;
		}

		// All events
		Object.entries(entry).forEach(([key]) => {
			entry[key] = null;
		});

		await this.client.provider.set(message.guild, 'log', entry);

		return 'Disabled all events';
	}
}
