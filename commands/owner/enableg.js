import { ArgConsts, ECommand } from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['enableg', 'enableglobal'],
			description: {
				content:  'Enables a command globally',
				usage:    '<command name>',
				examples: ['enableg ping']
			},
			args:        [
				{
					id:      'command',
					type:    ArgConsts.TYPE.WORD,
					message: 'Please mention a command name'
				}
			],
			guildOnly:   false,
			ownerOnly:   true,
		});
	}

	async run(message, { command }) {
		const c = this.client.commandHandler.commands.get(command);

		if (!c) {
			throw `Command \`${command}\` not found`;
		}

		const response = !c.disabled ? `\`${c.aliases[0]}\` is already enabled` : `Enabled \`${c.aliases[0]}\``;

		c.disabled = false;
		return response;
	}
}
