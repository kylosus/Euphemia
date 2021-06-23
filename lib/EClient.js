const { Client } = require('discord.js');

class EClient extends Client {
	constructor({
		ownerIDs = ['no'],
		// colorScheme
	}, djsOptions) {
		super(djsOptions);
		this.ownerIDs = ownerIDs;

		this.provider = null;

		this.on('message', m => {
			this.commandHandler.handle(m).catch(console.warn);
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
