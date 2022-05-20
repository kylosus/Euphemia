import { Formatters, Permissions } from 'discord.js';
import { ArgConsts, ECommand }     from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['enable', 'enablecommand'],
			description:     {
				content:  'Enables a command in the server',
				usage:    '<command name>',
				examples: ['enable ping']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args:            [
				{
					id:      'command',
					type:    ArgConsts.TYPE.WORD,
					message: 'Please mention a command name'
				}
			],
			guildOnly:       true,
			ownerOnly:       false,
		});
	}

	async run(message, { command }) {
		const c = this.client.commandHandler.commands.get(command);

		if (!c) {
			throw `Command ${Formatters.inlineCode(command)}  not found`;
		}

		const entry = this.client.provider.get(message.guild, 'disabledCommands', {});

		if (!entry[command]) {
			return `Command ${Formatters.inlineCode(command)}  is already enabled in this guild`;
		}

		delete entry[command];

		await this.client.provider.set(message.guild, 'disabledCommands', entry);

		return `Enabled ${Formatters.inlineCode(command)}  in this server`;
	}
}
