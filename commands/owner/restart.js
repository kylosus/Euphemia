const { ECommand } = require('../../lib');
const { spawn }    = require('child_process');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['restart'],
			description: {
				content:  'Restarts the bot. Be careful when using with pm2 and other managers',
				usage:    '',
				examples: ['restart']
			},
			guildOnly:   false,
			ownerOnly:   true,
		});
	}

	async run(message) {
		const subprocess = spawn(process.argv[0], [process.argv[1]], {
			detached: true
		});

		subprocess.unref();

		await this.sendNotice(message, '👌');

		process.exit(0);
	}
};