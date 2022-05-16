import { Client } from 'discord.js';

export default class EClient extends Client {
	constructor({
		ownerIDs = ['no'],
		config = (() => { throw 'Config not provided'; })()
		// colorScheme
	}, djsOptions) {
		super(djsOptions);
		this.ownerIDs = ownerIDs;
		this.owners   = [];

		this.config = config;

		this.provider = null;

		this.once('ready', () => {
			this.ownerIDs.forEach(async id => {
				this.owners.push(await this.users.fetch(id));
			});
		});

		this.on('messageCreate', m => {
			this.commandHandler.handle(m).catch();
		});

		// this.once('ready', () => {
		// 	this.on('message', m => {
		// 		this.commandHandler.handle(m).catch(console.warn);
		// 	});
		//
		// 	// Maybe in the future
		// 	// this.on('messageUpdate', (oldMessage, newMessage) => {
		// 	// 	if (oldMessage.content === newMessage.content) {
		// 	// 		return;
		// 	// 	}
		// 	//
		// 	// 	this.commandHandler.handle(newMessage).catch(console.warn);
		// 	// });
		// });
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
