const { Client } = require('discord.js');

class EClient extends Client {
	constructor({
		ownerIDs = ['no'],
		defaultColor = 0,
		// colorScheme
	}, djsOptions) {
		super(djsOptions);
		this.ownerIDs = ownerIDs;
		this.owners = [];

		this.defaultColor = defaultColor;

		this.provider = null;

		this.once('ready', () => {
			this.ownerIDs.forEach(async id => {
				this.owners.push(await this.users.fetch(id));
			});
		});

		this.once('ready', () => {
			this.on('message', m => {
				this.commandHandler.handle(m).catch(console.warn);
			});
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
