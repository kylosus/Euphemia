const { Client } = require('discord.js');

class EClient extends Client {
	constructor(options = {
		ownerID: '',
		// colorScheme
	}, djsOptions) {
		super(djsOptions);
		this.ownerID = options.ownerID;

		this.provider = null;

		this.on('message', m => {
			this.commandHandler.handle(m);
		});
	}

	async setProvider(provider) {
		this.provider = await provider;

		this.on('ready', () => {
			this.provider.loadGuilds(this.guilds.cache);
		});

		this.emit('providerReady');

		// Linter
		return null;
	}

}

module.exports = EClient;
