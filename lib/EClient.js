const { Client } = require('discord.js');

class EClient extends Client {
	constructor(options = {
		ownerID: '',
		// colorScheme
	}, djsOptions) {
		super(djsOptions);
		this.ownerID = options.ownerID;
		this.commandHandler = null;
	}
}

module.exports = EClient;
