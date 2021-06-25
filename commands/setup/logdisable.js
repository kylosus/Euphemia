const { Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

const { getSettings } = require('./log');

module.exports =  class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['logdisable', 'logdis'],
			description: {
				content: 'Disables log events in channels. Run without the second argument to disable everything',
				usage: '[channel (or current channel)] [event name]',
				examples: [
					'log list',
					'logdisable #channel ',
					'logdisable #channel guildBanAdd'
				]
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args: [
				{
					id: 'event',
					type: ArgConsts.TEXT,
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
		const entry = this.client.provider.get(message.guild, 'log', getSettings());

		// Single event
		if (args.event) {
			if (!Object.hasOwnProperty.call(entry, args.event)) {
				throw `Event ${args.event} not found`;
			}

			entry[args.event] = null;

			await this.client.provider.set(message.guild, 'log', entry);
			return `Disabled ${args.event}`;
		}

		// All events
		Object.entries(entry)
			.forEach(([key]) => {
				entry[key] = null;
			});

		await this.client.provider.set(message.guild, 'log', entry);

		return 'Disabled all events';
	}
};
