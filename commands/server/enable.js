const { Permissions }         = require('discord.js');
const { ArgConsts, ECommand } = require('../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['enable'],
			description:     {
				content:  'Enables a command in the server',
				usage:    '<command name>',
				examples: ['enable ping']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args:            [
				{
					id:      'command',
					type:    ArgConsts.WORD,
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
			throw `Command \`${command}\` not found`;
		}

		const entry = this.client.provider.get(message.guild, 'disabledCommands', {});

		if (!entry[command]) {
			return `Command \`${command}\` is already enabled in this guild`;
		}

		delete entry[command];

		await this.client.provider.set(message.guild, 'disabledCommands', entry);

		return `Enabled \`${command}\` in this server`;
	}
};
