const db = require('./db');
const watcher = require('./watcher');

const init = async (client, _db) => {
	await db.init(client, _db);
	await watcher.init(client);
};

module.exports = {
	init,
	mutedRole: require('./mutedRole'),
	muteHandler: require('./muteHandler')
};
