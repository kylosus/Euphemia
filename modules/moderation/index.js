const db = require('./db');
const {join} = require('path');

const init = async (client, _db) => {
	await db.init(client, _db);
	await client.commandHandler.registerCommands(join(__dirname, './commands'), 'Modlog');
};

module.exports = {
	init,
	ModerationCommand: require('./ModerationCommand'),
	ModerationCommandResult: require('./ModerationCommandResult')
};
