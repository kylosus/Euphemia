const { ArgConsts, ECommand } = require('../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['die', 'shutdown'],
			description: {
				content:  'Kills the bot',
				usage:    '[exit code]',
				examples: ['die', 'die 1']
			},
			args:        [
				{
					id:       'code',
					type:     ArgConsts.NUMBER,
					optional: true,
					default:  () => 0,
				},
			],
			guildOnly:   false,
			ownerOnly:   true,
		});
	}

	async run(message, { code }) {
		await this.sendNotice(message, '👋');
		process.exit(code);
	}
};
