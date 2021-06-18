const { Client } = require('discord.js');

class EClient extends Client {
	constructor(options = {
		ownerID: '',
		// colorScheme
	}, djsOptions) {
		super(djsOptions);
		this.ownerID = options.ownerID;
		this.commandHandler = null;
		this.provider = null;

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
